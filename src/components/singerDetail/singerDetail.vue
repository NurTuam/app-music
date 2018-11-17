<template>
	<transition name="slide">
		<music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
	</transition>
</template>

<script>
	import MusicList from "../music-list/music-list"
	import {url,params,ERR_OK,callback} from "../../api/getSingerDetail"
	import {mapGetters} from "vuex"
	import createSong from "../../common/js/song"
	export default {
		data(){
			return{
				songs:[]
			}
		},
		created(){
			this._getDetail();
		},
		computed:{
			title(){
				//歌手的名字
				return this.singer.name;
			},
			bgImage(){
				//歌手的头像
				return this.singer.avatar;
			},
			...mapGetters(['singer'])
		},
		methods:{
			_getDetail(){
//				console.log(this.$route.params.id)
            	//let singermid=this.$route.params.id;  //路由参数
            	if(!this.singer.id){
            		this.$router.push('/singer');
            		return;
            	}
            	let singermid=this.singer.id;
				this.$http.jsonp(url,{
				params:{...params,singermid},
				'jsonp':callback
			}).then((res)=>{
//				console.log(res.body)
    
                if(res.body.code==ERR_OK){
//              	console.log(res.body.data.list)
//                  console.log(this._normalizeSongs(res.body.data.list));
                    this.songs=this._normalizeSongs(res.body.data.list);
                    this.$store.commit('list',this.songs)
                }
			})
		  },
		  _normalizeSongs(list){
		  	let ret=[];
		  	list.forEach((item)=>{
		  		let {musicData}=item;
		  		if(musicData.songid&&musicData.albummid){  //songid改为songmid也行
		  			ret.push(createSong(musicData));
		  		}
		  	})
		  	return ret;
		  }
		},
		components:{
            MusicList
        },
        watch:{
        	singer(){
        		this._getDetail();
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