<template>
	<transition name="slide">
		<music-list :songs="songs" :title="title" :bg-image="bgImage" :rank="true"></music-list>
	</transition>
</template>

<script>
	import MusicList from "../music-list/music-list"
	import obj from "../../api/getRankDetail"
	import {mapGetters} from "vuex"
	import createSong from "../../common/js/song"
	export default{
		data(){
			return{
				songs:[],
				rank:true
			}
		},
		components:{
			MusicList
		},
		computed:{
			title(){
				return this.topList.topTitle;
			},
			bgImage(){
			if(this.songs.length){
				return this.songs[0].image;
			}
			return "";	
			},
			...mapGetters([
        		'topList'
      		])
		},
		created(){
			this._getTopListDetail();
		},
		methods:{
			_getTopListDetail(){
//				console.log(this.$route.params.id)
				if(!this.topList.id){
            		this.$router.push('/rank');
            		return;
            	}
				let rankmid=this.topList.id;
				this.$http.jsonp(obj.url,{
				params:{...obj.params,topid:rankmid},
				'jsonp':obj.callback
				}).then((res)=>{
//					console.log(res.data)
                if(res.code==obj.ERR_OK){
//              	console.log(res.data.songlist)
//              	console.log(this._normalizeList(res.data.songlist));					
                    this.songs=this._normalizeList(res.data.songlist);
                    this.$store.commit('list',this.songs);
                	}
			 	})
			},
			_normalizeList(list){
				let ret = [];
				list.forEach((item)=>{
					let musicData = item.data;
					if (musicData.songmid&&musicData.albummid) {
						ret.push(createSong(musicData));
					}
				})
				return ret;
			}		
		}
	}
	
</script>

<style scoped lang="stylus">
    @import "../../common/stylus/variable"
    .slide-enter-active, .slide-leave-active
        transition: all 0.3s
    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>