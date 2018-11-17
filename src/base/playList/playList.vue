<template>
	<transition name="list-fade">
	<div class="playlist" v-show="showFlag" @click="hide">
		<div class="list-wrapper" @click.stop>
			<div class="list-header">
				<h1 class="title">
					<i :class="iconMode" @click="changeMode"></i>
					<span class="text">{{modeText}}</span>
					<span class="clear" @click="showConfirm">
					<i class="icon-clear"></i>
					</span>
				</h1>
			</div>
			<scroll class="list-content" :data="sequenceList" ref="listContent" :refreshDelay="refreshDelay">
				<ul>
					<li class="item" v-for="(item,index) in sequenceList" @click="selectItem(item,index)" ref="listItem">
						<i class="current" :class="getCurrentIcon(item)"></i>
						<span class="text">{{item.name}}</span>
						<span class="like">
						<i :class="getFavoriteIcon(item)"></i>
						</span>
						<span class="delete" @click.stop="deteleOne(item)">
							<i class="icon-delete"></i>
						</span>
					</li>
				</ul>
			</scroll>
			<div class="list-operate">
				<div class="add" @click="addSong">
					<i class="icon-add"></i>
					<span class="text">添加歌曲到队列</span>
				</div>
			</div>
			<div class="list-close" @click="hide()">
				<span>关闭</span>
			</div>
		</div>
		<confirm text="是否清空播放列表" @confirm="confirmClear" confirmBtnText="清空" ref="confirm"></confirm>
		<add-song ref="addSong"></add-song>
	 </div>
	 </transition>
</template>

<script>
	import {mapGetters,mapActions,mapMutations} from "vuex"
	import Scroll from "../scroll/scroll"
	import {shuffle} from "../../common/js/util"
	import {playMode} from "../../common/js/config"
	import {findIndex} from "../../common/js/findIndex"
	import Confirm from "../confirm/confirm"
	import addSong from "../../components/addSong/addSong"
	export default{
		data(){
			return{
				showFlag:false,
				refreshDelay:100,
				listbbb:[]
			}
		},
		components:{
			Scroll,
			Confirm,
			addSong
		},
		computed:{
			modeText(){
				return this.mode==playMode.sequence?'顺序播放':this.mode==playMode.loop?'随机播放':'单曲循环';
			},
			iconMode(){
				return this.mode==playMode.sequence?'icon-sequence':this.mode==playMode.loop?'icon-loop':'icon-random';
			},
			listaaa:function()
			{
				return this.$store.state.favoriteList;
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
			created:function()
			{
//				console.log(this.$store.state.favoriteList)
				this.listbbb = this.$store.state.favoriteList;
			},
			methods:{
			 ...mapActions([
				'deleteSong',
				'deleteSongList',
				'saveFavoriteList',
      			'deleteFavoriteList'
			 ]),
			deteleOne(item){
				this.deleteSong(item);
				if(!this.playList.length){
					this.hide();
				}
			},
			show(){
				this.showFlag=true;
				if(this.$refs.listContent){
					this.$refs.listContent.refresh();	
				}	
				this.scrollToCurrent(this.currentSong);
			},
			hide(){
				this.showFlag=false;
			},
			getCurrentIcon(item){
				if(this.currentSong.id==item.id){
					return 'icon-play'
				}
			},
			selectItem(item,index){
				if(this.mode==playMode.random){
					index=this.playList.findIndex((song)=>{
						return song.id==item.id;
					})
				}
				this.setCurrentIndex(index);
				this.setPlayingState(true);
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
			showConfirm(){
				this.$refs.confirm.show();
			},
			confirmClear(){
				this.deleteSongList();
				this.hide();
			},
			scrollToCurrent(current){
				const index=this.sequenceList.findIndex((song)=>{
					return current.mid==song.mid;
				})
				this.$refs.listContent.scrollToElement(this.$refs.listItem[index],300);
			},
			addSong(){
				this.$refs.addSong.show();
			},
			
			getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite';
      }
      return 'icon-not-favorite';
    	},
    	isFavorite(song){
				for(var n=0;n<this.sequenceList.length;n++)
				{
					if(song.songmid==this.sequenceList[n].songmid)
					{
						return 1;
					}
				}
    	},
			...mapMutations({
				"setPlaying":"SET_PLAYING",
				"setCurrentIndex":"SET_CURRENT_INDEX",
				"setFullScreen":"SET_FULL_SCREEN",
				"setPlayMode":"SET_PLAY_MODE",
				"setPlayList":"SET_PLAYLIST",
				"setPlayingState":"SET_PLAYING_STATE"
			})
		},
		watch:{
		listaaa:function(n)
		{
			this.listbbb=n;
		},
			currentSong(newSong,oldSong){
				if(!this.showFlag ||newSong.id==oldSong.id){
					return;
				}
				this.scrollToCurrent(newSong);
			}
		}
	}
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>