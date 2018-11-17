<template>
	<div class="player" v-if="currentSong">
		<transition name="normal">
			<div class="normal-player" v-show="fullScreen">
				<div class="background">
					<img :src="currentSong.image" width="100%" height="100%"/>
				</div>
				<div class="top">
					<div class="back" @click="back">
						<i class="icon-back"></i>
					</div>
					<h1 class="title" v-html="currentSong.name"></h1>
					<h2 class="subtitle" v-html="currentSong.singer"></h2>
				</div>
				<div class="middle" @touchstart.prevent="MiddleTouchStart" @touchmove.prevent="MiddleTouchMove" @touchend="MiddleTouchEnd">
					<div class="middle-l" ref="middleL">
						<div class="cd-wrapper">
							<div class="cd" :class="cdCls">
								<img :src="currentSong.image" class="image"/>
							</div>
						</div>
					</div>
					<scroll class="middle-r" :data="currentLyric&&currentLyric.lines" ref="lyricList">
						<div class="lyric-wrapper">
							<div v-if="currentLyric">
								<p class="text" v-for="(line,index) in currentLyric.lines" :class="{'current':index==currentLineNum}" ref="lyricline">
									{{line.txt}}
								</p>
							</div>
						</div>
					</scroll>
				</div>
				<div class="bottom">
					<div class="dot-wrapper">
						<span class="dot" :class="{'active' : currentShow == 'cd'}"></span>
						<span class="dot" :class="{'active' : currentShow == 'lyric'}"></span>
					</div>
					<div class="progress-wrapper">
						<span class="time time-l">{{format(currentTime)}}</span>
						<div class="progress-bar-wrapper">
							<progress-bar :percent="percent" @percentChange="percentChange"></progress-bar>
						</div>
						<span class="time time-r">{{format(currentSong.duration)}}</span>
					</div>
					<div class="operators">
						<div class="icon i-left">
							<i :class="iconMode" @click="changeMode"></i>
						</div>
						<div class="icon i-left" :class="disableCls">
							<i class="icon-prev" @click="prev"></i>
						</div>
						<div class="icon i-center" :class="disableCls">
							<i :class="playIcon" @click="togglePlaying"></i>
						</div>
						<div class="icon i-right" :class="disableCls">
							<i class="icon-next" @click="next"></i>
						</div>
						<div class="icon i-right">
							<i @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
						</div>
					</div>
				</div>
			</div>
		</transition>
		<transition name="mini">
			<div class="mini-player" v-show="!fullScreen" @click="open">
				<div class="icon">
					<img :src="currentSong.image" width="40" height="40" :class="cdCls"/>
				</div>
				<div class="text">
					<h2 class="name" v-html="currentSong.name"></h2>
					<p class="desc" v-html="currentSong.singer"></p>
				</div>
				<div class="control">
					<i :class="miniIcon" @click.stop="togglePlaying"></i>
				</div>
				<div class="control" @click.stop="showPlayList">
					<i class="icon-playlist"></i>
				</div>
			</div>
		</transition>
		<play-list ref="playList"></play-list>
		<audio :src="currentSong.url" @timeupdate="updateTime" ref="audio" @ended="end" @error="error"></audio>
	</div>
</template>

<script>
	import {mapGetters,mapMutations,mapActions} from "vuex"
	import { Base64 } from 'js-base64'
	import axios from "axios"
	import Scroll from "../../base/scroll/scroll"
	import {url,params,ERR_OK} from "../../api/getLyric"
	import {playMode} from "../../common/js/config"
	import ProgressBar from "../../base/progress-bar/progress-bar"
	import Lyric from "lyric-parser"
	import {shuffle} from "../../common/js/util"
	import {findIndex} from "../../common/js/findIndex"
	import playList from "../../base/playList/playList"
	export default{
		data(){
			return{
				songReady:false,
				currentTime:0,
				currentLyric:null,
				currentLineNum:0,
				currentShow:"cd"
			}
		},
		created(){
			this.touch={}
		},
		components:{
			ProgressBar,
			Scroll,
			playList
		},
		computed:{
			iconMode(){
//				console.log(this.mode)
				return this.mode==playMode.sequence?'icon-sequence':this.mode==playMode.loop?'icon-loop':'icon-random';
			},
			playIcon(){
				return this.playing?'icon-pause':'icon-play';
			},
			cdCls(){
				return this.playing?'play':'play pause';
			},
			miniIcon(){
				return this.playing?'icon-pause-mini':'icon-play-mini';
			},
			percent(){
				return this.currentTime/this.currentSong.duration;
			},
			disableCls(){
				return this.songReady ? '' : 'disable';
			},
			...mapGetters([
				'currentSong',
				'fullScreen',
				'mode',
				'playing',
				'playList',
				'sequenceList',
				'currentIndex',
				'favoriteList'
			])  //响应式的 这里改了相应的vue、视图也会改
		},
		methods:{
			format(interval){
				//格式化播放时长
				interval=Math.floor(interval);
				let minute=Math.floor(interval/60);
				let second=interval%60;
				second=second<10?'0'+second:second;
				return `${minute}:${second}`
			},
			updateTime(e){
				//更新播放事件
//				console.log(e.target.currentTime)
                this.currentTime=e.target.currentTime;
			},
			togglePlaying(){
				//切换播放状态
//			   	this.$store.commit("SET_PLAYING",!this.playing)
                this.setPlaying(!this.playing);
                if(this.currentLyric){
                	this.currentLyric.togglePlay();
                }
			},
			error(){
				this.songReady=true;
			},
			prev(){
				//切换上一首
				let index=this.currentIndex-1;
//				this.$store.commit('SET_CURRENT_INDEX',index);
				if(index<=-1){
					index=this.playList.length-1;
				}
				this.setCurrentIndex(index);
				if(!this.playing){
					this.togglePlaying();
				}
			},
			next(){
				//切换下一首
				let index=this.currentIndex+1;
//				this.$store.commit('SET_CURRENT_INDEX',index);
				if(index>this.playList.length-1){
					index=0;
				}
				this.setCurrentIndex(index);
				if(!this.playing){
					this.togglePlaying();
				}
			},
			toggleFavorite(song){
				if(this.isFavorite(song)){
					this.deleteFavoriteList(song);
				}else{
					this.saveFavoriteList(song);
				}
			},
			getFavoriteIcon(song){
				if(this.isFavorite(song)){
					return 'icon-favorite';
				}
				return 'icon-not-favorite';
			},
			isFavorite(song){
//				const index=this.favoriteList.findIndex((item)=>{
//					return item.id=song.id;
//				})
//				return index > -1;
			},
			back(){
				//打开最小化播放器
				this.setFullScreen(false);
			},
			open(){
				//最大化播放器
				this.setFullScreen(true);
			},
			changeMode(){
				const mode=(this.mode+1)%3;   //求余 除以3 保持在0 1 2
				this.setPlayMode(mode);
				//如果顺序播放，播放列表就是顺序列表，如果是随机播放，要把顺序列表打乱顺序后的新数组存入播放列表
				let list=null;  //存入的播放列表
				if(mode==playMode.random){
					list=shuffle(this.sequenceList);
				}else{
					list=this.sequenceList;
				}
				this._resetCurrentIndex(list);
				this.setPlayList(list);
			},
			_resetCurrentIndex(list){
				let index=list.findIndex((item)=>{       //找到它的索引
					return item.id==this.currentSong.id;
				})
				this.setCurrentIndex(index);
			},
			end(){
				if(this.mode==playMode.loop){
					this.loop();
				}else{
					this.next();
				}
			},
			loop(){
				this.$refs.audio.currentTime=0;
				this.$refs.audio.play();
				
				// 循环播放 歌词回到开始的时候
        		if (this.currentLyric) {
          		  this.currentLyric.seek(0)
        		}
			},
			percentChange(newPercent){
//				this.currentTime=this.currentSong.duration*newPercent;
				this.$refs.audio.currentTime=this.currentSong.duration*newPercent;
				if(!this.playing){
					this.togglePlaying();
				}
				if(this.currentLyric){
					this.currentLyric.seek(this.$refs.audio.currentTime*1000);
				}
			},
			_getLyric(){
				axios.get(url,{
					params:{...params,songmid:this.currentSong.mid}
				}).then((res)=>{
//					console.log(res.data)
//                  console.log(JSON.parse(res.data))
                    res=JSON.parse(res.data);
                    if(res.code==ERR_OK){
                    	this.lyric=Base64.decode(res.lyric);
//                  	console.log(lyric)
                        this.currentLyric=new Lyric(this.lyric,this.handleLyric);
//                      console.log(this.currentLyric)
                        if(this.playing){
                        	this.currentLyric.play();
                        }
                    }
				})
			},
			handleLyric({lineNum,txt}){
//				console.log(lineNum);  //行号
//				console.log(txt);      //歌词内容
                this.currentLineNum=lineNum;
                if(lineNum>5){
                	let lineEl = this.$refs.lyricline[lineNum-5];
                	this.$refs.lyricList.scrollToElement(lineEl,1000);
                }else{
                	this.$refs.lyricList.scrollTo(0,0,100);
                }
                this.playingLyric=txt;
			},
			MiddleTouchStart(e){
				this.touch.initiated=true;
				this.touch.startX=e.touches[0].pageX;
				this.touch.startY=e.touches[0].pageY;
			},
			MiddleTouchMove(e){
				if(!this.touch.initiated){
					return;
				}
				const deltaX=e.touches[0].pageX-this.touch.startX;
				const deltaY=e.touches[0].pageY-this.touch.startY;
				//左滑 - cd去lyric 不允许大于0
				//右滑 + lyric去cd 不允许小于0
				if(Math.abs(deltaY)>Math.abs(deltaX)){    //abs绝对值
                    return;
                }
				if (!this.touch.moved) {
          			this.touch.moved = true
        		}
                const left = this.currentShow=="cd"?0:-window.innerWidth;
                //滚动的距离 最大是0
                const offsetWidth = Math.min(0,Math.max(left+deltaX,-window.innerWidth));
                this.touch.percent = Math.abs(offsetWidth/window.innerWidth);
                this.transform(offsetWidth,1-this.touch.percent);
            },
			MiddleTouchEnd(e){
				let offsetWidth;
				let opacity;
				if(this.currentShow=="cd"){
					if(this.touch.percent>0.1){
						opacity=0;
						offsetWidth=-window.innerWidth;
						this.currentShow="lyric";
					}else{
						opacity=1;
						offsetWidth=0;
					}
				}else{
					if(this.touch.percent<0.9){
						offsetWidth=0;
						opacity=1;
						this.currentShow="cd";
					}else{
						offsetWidth=-window.innerWidth;
						opacity=0;
					}
				}
				this.transform(offsetWidth,opacity);
			},
			transform(offsetWidth,opacity){
				//布局 左侧滑动 右侧在原地 所以让右侧滑入
				this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`;
				this.$refs.lyricList.$el.style.webkitTransform = `translate3d(${offsetWidth}px,0,0)`;
				this.$refs.middleL.style.opacity=opacity;
			},
			showPlayList(){
				this.$refs.playList.show();
			},
			...mapMutations({
				"setPlaying":"SET_PLAYING",
				"setCurrentIndex":"SET_CURRENT_INDEX",
				"setFullScreen":"SET_FULL_SCREEN",
				"setPlayMode":"SET_PLAY_MODE",
				"setPlayList":"SET_PLAYLIST"
			})
		},
		watch:{
			currentSong(){
				if(this.currentLyric){
					//防止多个定时器同时运行
					this.currentLyric.stop();
					this.currentLineNum=0;
				}
				this._getLyric();
				this.$nextTick(()=>{
					const audio=this.$refs.audio;
					audio.play();
				})
			},
			playing(newPlaying){
//				if(this.currentLyric){
//					this.currentLyric.stop();
//				}
				this.$nextTick(()=>{
					const audio=this.$refs.audio;
//					console.log(audio)
					newPlaying?audio.play():audio.pause();
				})
			}
			
		}
	}
</script>

<style scoped lang="stylus">
    @import "../../common/stylus/variable"
    @import "../../common/stylus/mixin"

    .player
        .normal-player
            position: fixed
            left: 0
            right: 0
            top: 0
            bottom: 0
            z-index: 150
            background: $color-background
            .background
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                z-index: -1
                opacity: 0.6
                filter: blur(20px)
            .top
                position: relative
                margin-bottom: 25px
                .back
                    position absolute
                    top: 0
                    left: 6px
                    z-index: 50
                    .icon-back
                        display: block
                        padding: 9px
                        font-size: $font-size-large-x
                        color: $color-theme
                        transform: rotate(-90deg)
                .title
                    width: 70%
                    margin: 0 auto
                    line-height: 40px
                    text-align: center
                    no-wrap()
                    font-size: $font-size-large
                    color: $color-text
                .subtitle
                    line-height: 20px
                    text-align: center
                    font-size: $font-size-medium
                    color: $color-text
            .middle
                position: fixed
                width: 100%
                top: 80px
                bottom: 170px
                white-space: nowrap
                font-size: 0
                .middle-l
                    display: inline-block
                    vertical-align: top
                    position: relative
                    width: 100%
                    height: 0
                    padding-top: 80%
                    .cd-wrapper
                        position: absolute
                        left: 10%
                        top: 0
                        width: 80%
                        height: 100%
                        .cd
                            width: 100%
                            height: 100%
                            box-sizing: border-box
                            border: 10px solid rgba(255, 255, 255, 0.1)
                            border-radius: 50%
                            &.play
                                animation: rotate 20s linear infinite
                            &.pause
                                animation-play-state: paused
                            .image
                                position: absolute
                                left: 0
                                top: 0
                                width: 100%
                                height: 100%
                                border-radius: 50%

                    .playing-lyric-wrapper
                        width: 80%
                        margin: 30px auto 0 auto
                        overflow: hidden
                        text-align: center
                        .playing-lyric
                            height: 20px
                            line-height: 20px
                            font-size: $font-size-medium
                            color: $color-text-l
                .middle-r
                    display: inline-block
                    vertical-align: top
                    width: 100%
                    height: 100%
                    overflow: hidden
                    .lyric-wrapper
                        width: 80%
                        margin: 0 auto
                        overflow: hidden
                        text-align: center
                        .text
                            line-height: 32px
                            color: $color-text-l
                            font-size: $font-size-medium
                            &.current
                                color: $color-text
            .bottom
                position: absolute
                bottom: 50px
                width: 100%
                .dot-wrapper
                    text-align: center
                    font-size: 0
                    .dot
                        display: inline-block
                        vertical-align: middle
                        margin: 0 4px
                        width: 8px
                        height: 8px
                        border-radius: 50%
                        background: $color-text-l
                        &.active
                            width: 20px
                            border-radius: 5px
                            background: $color-text-ll
                .progress-wrapper
                    display: flex
                    align-items: center
                    width: 80%
                    margin: 0px auto
                    padding: 10px 0
                    .time
                        color: $color-text
                        font-size: $font-size-small
                        flex: 0 0 30px
                        line-height: 30px
                        width: 30px
                        &.time-l
                            text-align: left
                        &.time-r
                            text-align: right
                    .progress-bar-wrapper
                        flex: 1
                .operators
                    display: flex
                    align-items: center
                    .icon
                        flex: 1
                        color: $color-theme
                        &.disable
                            color: $color-theme-d
                        i
                            font-size: 30px
                    .i-left
                        text-align: right
                    .i-center
                        padding: 0 20px
                        text-align: center
                        i
                            font-size: 40px
                    .i-right
                        text-align: left
                    .icon-favorite
                        color: $color-sub-theme
            &.normal-enter-active, &.normal-leave-active
                transition: all 0.4s
                .top, .bottom
                    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
            &.normal-enter, &.normal-leave-to
                opacity: 0
                .top
                    transform: translate3d(0, -100px, 0)
                .bottom
                    transform: translate3d(0, 100px, 0)
        .mini-player
            display: flex
            align-items: center
            position: fixed
            left: 0
            bottom: 0
            z-index: 180
            width: 100%
            height: 60px
            background: $color-highlight-background
            &.mini-enter-active, &.mini-leave-active
                transition: all 0.4s
            &.mini-enter, &.mini-leave-to
                opacity: 0
            .icon
                flex: 0 0 40px
                width: 40px
                padding: 0 10px 0 20px
                img
                    border-radius: 50%
                    &.play
                        animation: rotate 10s linear infinite
                    &.pause
                        animation-play-state: paused
            .text
                display: flex
                flex-direction: column
                justify-content: center
                flex: 1
                line-height: 20px
                overflow: hidden
                .name
                    margin-bottom: 2px
                    no-wrap()
                    font-size: $font-size-medium
                    color: $color-text
                .desc
                    no-wrap()
                    font-size: $font-size-small
                    color: $color-text-d
            .control
                flex: 0 0 30px
                width: 30px
                padding: 0 10px
                .icon-play-mini, .icon-pause-mini, .icon-playlist
                    font-size: 30px
                    color: $color-theme-d
                .icon-mini
                    font-size: 32px
                    position: absolute
                    left: 0
                    top: 0

    @keyframes rotate
        0%
            transform: rotate(0)
        100%
            transform: rotate(360deg)
</style>