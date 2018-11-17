<template>
	<div class="search">
		<div class="search-box-wrapper">
			<search-box ref="searchBox" @query="onQueryChange"></search-box>
		</div>
		<div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
			<scroll class="shortcut" :data="shortCut" ref="shortcut" :refreshDelay="refreshDelay">
				<div class="hot-key">
					<h1 class="title">热门搜索</h1>
					<ul>
						<li class="item" v-for="item in hotkey" @click="addQuery(item.k)">
							<span>{{item.k}}</span>
						</li>
					</ul>
				</div>
				<!--搜索历史-->
				<div class="search-history" v-show="searchHistory">
					<h1 class="title">
						<span class="text">搜索历史</span>
						<span class="clear" @click="showConfirm">
							<i class="icon-clear"></i>
						</span>
					</h1>
					<!--搜索历史列表-->
					<search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
				</div>
			</scroll>
		</div>
		<div class="search-result" v-show="query" ref="searchResult">
			<!--搜索结果-->
			<suggest :query="query" @listScroll="blurInput" @select="saveSearch" ref="suggest"></suggest>
		</div>
		<router-view></router-view>
		<confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
	</div>
</template>

<script>
	import SearchBox from "../../base/searchBox/searchBox"
	import SearchList from "../../base/searchList/searchList"
	import Confirm from "../../base/confirm/confirm"
	import Scroll from "../../base/scroll/scroll"
	import {url,callback,ERR_OK,params} from "../../api/getHotKey"
	import {mapActions,mapGetters} from "vuex"
	import Suggest from "../suggest/suggest"
	export default{
		data(){
			return{
				query:"",
				hotkey:[],
				refreshDelay:100
			}
		},
		components:{
			Confirm,
			Scroll,
			SearchBox,
			SearchList,
			Suggest
		},
		computed:{
			shortCut(){
				return this.hotkey.concat(this.searchHistory);   //热门搜索与搜索历史进行拼接
			},
			...mapGetters([
				'searchHistory'
			])
		},
		created(){
			this._getHotKey();
		},
		methods:{
			_getHotKey(){
				this.$http.jsonp(url,{
					params,
					"jsonp":callback
				}).then((res)=>{
//					console.log(res.data)
					if(res.data.code==ERR_OK){
//						console.log(res.data.data.hotkey)
						this.hotkey= res.data.data.hotkey;
						
					}
				})
			},
			showConfirm(){
				this.$refs.confirm.show();
			},
			onQueryChange(query) {
      			this.query = query;
    		},
    		blurInput(){
    			this.$refs.searchBox.blur();
    		},
    		addQuery(query){
    			this.$refs.searchBox.setQuery(query);
    		},
    		saveSearch(query){
    			this.saveSearchHistory(this.query);
    		},
			...mapActions([
				'clearSearchHistory',
				'saveSearchHistory',
      			'deleteSearchHistory'
			])
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>