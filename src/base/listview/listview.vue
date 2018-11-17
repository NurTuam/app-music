<template>
	<scroll class="listview" :listenScroll="listenScroll" :probeType="probeType" @scroll="scroll" ref="listview">
		<ul>
			<li v-for="group in list"class="list-group" ref="listgroup">
				<h2 class="list-group-title">{{group.title}}</h2>
				<ul>
					<li v-for="item in group.items" class="list-group-item" @click="selectitem(item)">
						<img v-lazy="item.avatar" class="avatar"/>
						<span class="name">{{item.name}}</span>
					</li>
				</ul>
			</li>
		</ul>
		<div class="list-shortcut" @touchstart="onshortcuttouchstart" @touchmove.stop.prevent="onshortcuttouchmove">
			<ul>
				<li v-for="(item,index) in shortcutlist" :class="['item',{'current':index==currentindex}]" :data-index="index">
					{{item}}
				</li>
			</ul>
		</div>
		<div class="list-fixed" ref="fixed">
			<h1 class="fixed-title">
				{{fixedtitle}}
			</h1>
		</div>
	</scroll>
</template>

<script>
	import Scroll from "../scroll/scroll"
	import loading from "../loading/loading"
	const TITLE_HEIGHT=30;
	const ANCHOR_HEIGHT=18;
	export default{
		data(){
			return{
				scrollY:0,
				currentindex:0,
				diff:0
			}
		},
		props:{
			list:{
				type:Array,
				default:function(){
					return[]
				}
			}
		},
		computed:{
			shortcutlist(){
				return this.list.map((group)=>{
					return group.title.substr(0,1)
				})
			},
			fixedtitle(){
				if(this.scrollY>0){
					return ''
				}
				return this.list[this.currentindex]?this.list[this.currentindex].title:""
			}
		},
		components:{
			Scroll,
			loading
		},
		methods:{
			scroll(pos) {
//			    console.log(pos.y)
        		this.scrollY = pos.y;
//        		console.log(this.scrollY)
      		},
			_calculateHeight(){
				this.listHeight=[];
				const list =this.$refs.listgroup
				let height=0;
				this.listHeight.push(height);
				for(let i=0;i<list.length;i++){
					let item=list[i];
					height+=item.clientHeight;
					this.listHeight.push(height);
				}
//				console.log(this.listHeight)
			},
			onshortcuttouchstart(e){
				let anthorindex=e.target.getAttribute('data-index');
//				console.log(anthorindex)
				this.touch.y1=e.touches[0].pageY;
				this.touch.anthorindex=anthorindex;
				this._scrollTo(anthorindex);
			},
			onshortcuttouchmove(e){
				this.touch.y2=e.touches[0].pageY;
				let delta=Math.floor((this.touch.y2-this.touch.y1)/ANCHOR_HEIGHT);
				let anthorindex=+this.touch.anthorindex+delta;
//				console.log(anthorindex)
                this._scrollTo(anthorindex);
			},
			_scrollTo(index){
				if(!index&&index!=0){
					return;
				}
				//边界检测
				if(index<0){
					index=0;
				}else if(index>this.listHeight.length-2){
					index=this.listHeight.length-2;
				}
				//传入分组索引，调到响应分组
				this.currentindex=index;
				this.$refs.listview.scrollToElement(this.$refs.listgroup[index]);
			},
			selectitem(singer){
				this.$emit('select',singer)
			}
		},
		created(){
			this.probeType=3;
			this.listenScroll=true;
			this.touch={}
		},
		mounted(){
			this._calculateHeight()
		},
		watch:{
			list(){
				this.$nextTick(()=>{
					this._calculateHeight()
				})
			},
			scrollY(newY){
				//检测当前滑动的距离 根据滑动的距离计算出当前的index
				const listHeight=this.listHeight;//24  0~23
				//当滚动到上部  newY>0
	            if(newY>0){
	            	this.currentindex=0;
	            	return;
	            }
	            //在中间滚动
				for(let i=0;i<listHeight.length-1;i++){
					let startHeight=listHeight[i];
					let endHeight=listHeight[i+1];
					if(-newY>=startHeight&&-newY<endHeight){
						this.currentindex=i;
						//diff指的是下一个分组距离顶部的距离
						this.diff=endHeight+newY;
						return;
					}
				}
				//当滚动到底部，-newY肯定大于最后一个元素的上限
				this.currentindex=listHeight.length-2;
			},
			diff(newVal){
				//观测下一个分组距离顶部的距离
				let fixtop=(newVal>0&&newVal<TITLE_HEIGHT)?newVal-TITLE_HEIGHT:0;
				if(fixtop==this.fixtop){
					return;
				}
				this.fixtop=fixtop;
				this.$refs.fixed.style.transform=`translate3d(0,${fixtop}px,0)`;
                this.$refs.fixed.style.webkitTransform=`translate3d(0,${fixtop}px,0)`;
			}
		}
	}
</script>

<style scoped lang="stylus">
    @import "../../common/stylus/variable"
    .listview
        position: relative
        width: 100%
        height: 100%
        overflow: hidden
        background: $color-background
        .list-group
            padding-bottom: 30px
            .list-group-title
                height: 30px
                line-height: 30px
                padding-left: 20px
                font-size: $font-size-small
                color: $color-text-l
                background: $color-highlight-background
            .list-group-item
                display: flex
                align-items: center
                padding: 20px 0 0 30px
                .avatar
                    width: 50px
                    height: 50px
                    border-radius: 50%
                .name
                    margin-left: 20px
                    color: $color-text-l
                    font-size: $font-size-medium
        .list-shortcut
            position: absolute
            z-index: 30
            right: 0
            top: 50%
            transform: translateY(-50%)
            width: 20px
            padding: 20px 0
            border-radius: 10px
            text-align: center
            background: $color-background-d
            font-family: Helvetica
            .item
                padding: 3px
                line-height: 1
                color: $color-text-l
                font-size: $font-size-small
                &.current
                    color: $color-theme
        .list-fixed
            position: absolute
            top: 0
            left: 0
            width: 100%
            .fixed-title
                height: 30px
                line-height: 30px
                padding-left: 20px
                font-size: $font-size-small
                color: $color-text-l
                background: $color-highlight-background
        .loading-container
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)
</style>