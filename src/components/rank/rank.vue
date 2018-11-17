<template>
	<div class="rank" ref="rank">
		<scroll class="toplist" :list="topList" ref="topList">
			<ul>
				<li class="item" v-for="item in topList" @click="jump(item)">
					<div class="icon">
						<img width="100" height="100" v-lazy="item.picUrl" alt=""/>
					</div>
					<ul class="songlist">
						<li class="song" v-for="(song,index) in item.songList">
							<span>{{index+1}}</span>
							<span>{{song.songname}}-{{song.singername}}</span>
						</li>
					</ul>
				</li>
			</ul>			
		</scroll>
		<router-view></router-view>
	</div>
</template>

<script>
	import {url,callback,ERR_OK,params} from "../../api/getRankList"
	import Scroll from "../../base/scroll/scroll"
	import { mapMutations } from 'vuex'
	export default{
		data(){
			return{
				topList:[],
				rank:{}
			}
		},
		created(){
			this._getTopList();
		},
		components:{
			Scroll
		},
		methods:{
			_getTopList(){
				this.$http.jsonp(url,{
					params,
					"jsonp":callback
				}).then((res)=>{
//					console.log(res.data)
					if(res.data.code==ERR_OK){
//						console.log(res.data.data.topList)
						this.topList= res.data.data.topList;
						
					}
				})
			},
			jump(item){
				this.$router.push({
					path:`/rank/${item.id}`
				})
				this.setTopList(item);
			},
			...mapMutations({
				"setTopList":"SET_TOP_LIST"
			})
		}
	}
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

   .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>