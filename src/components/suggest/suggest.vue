<template>
	<scroll class="suggest" ref="suggest" :data="result" :pullUp="pullUp" @scrollToEnd="searchMore" :beforeScroll="beforeScroll" @beforeScroll="listScroll">
		<ul class="suggest-list">
			<li class="suggest-item" v-for="item in result" @click="selectItem(item)">
				<div class="icon">
					<i :class="getIconCls(item)"></i>
				</div>
				<div class="name">
					<p class="text" v-html="getDisplayName(item)"></p>
				</div>
			</li>
			<loading v-show="hasMore"></loading>
		</ul>
		<div class="no-result-wrapper" v-show="!hasMore&&!result.length">
			<no-result title="抱歉，暂无搜索结果"></no-result>
		</div>
	</scroll>
</template>

<script>
	import {url,params,ERR_OK,callback} from "../../api/getSearch"
	import singer from "../../common/js/singer"
	import Loading from "../../base/loading/loading"
	import Scroll from "../../base/scroll/scroll"
	import NoResult from "../../base/noResult/noResult"
	export default{
		components:{
			Scroll,
			NoResult,
			Loading
		}
	}
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>