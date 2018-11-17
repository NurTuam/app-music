<template>
	<div class="singer">
		<list-view :list="singers" v-if="singers.length" @select="selectsinger"></list-view>
		<router-view></router-view>
	</div>
</template>

<script>
	import listView from "../../base/listview/listview"
	import {url,callback,ERR_OK,params} from "../../api/getsingerList"
	import singer from "../../common/js/singer"
	import {mapMutations} from "vuex"
	const HOT_NAME ="热门";   //定一个常量，方便修改  通常为大写
	const HOT_SINGER_LEN=10;
 	export default{
		data(){
			return{
				singers:[],
				singer:{}
			}
		},
		components:{
			listView
		},
		methods:{
			_getsingerlist(){
				this.$http.jsonp(url,{
					params,
					"jsonp":callback
				}).then((res)=>{
//					console.log(res.body)
                    if(res.body.code==ERR_OK){
                    	this.singers=this._normallizeSinger(res.data.data.list);
//                  	console.log(res.data.data.list)
//                      console.log(this.singers)
                    }
     
				})
			},
			_normallizeSinger(list){
				let map = {
					hot:{
						title:HOT_NAME,
						items:[]
					}
				};
				list.forEach((item,index)=>{   //ES5遍历方法
					if(index<HOT_SINGER_LEN){
						 map.hot.items.push(new singer(
                            {
                                id:item.Fsinger_mid,
                                name:item.Fsinger_name
                            }
                        ))
					}		
					const key=item.Findex;
					if(!map[key]){
						map[key]={
							title:key,
							items:[]
						}
					}
					map[key].items.push(new singer(
                        {
                            id:item.Fsinger_mid,
                            name:item.Fsinger_name
                        }
                    ))
					
				});      
//				console.log(map)

//              序列化
                let hot=[];
                let ret=[];
                for(let key in map){
                	let val=map[key];
                    if(val.title.match(/[a-zA-Z]/)){
                    	ret.push(map[key])
                    }else if(val.title==HOT_NAME){
                    	hot.push(val)
                    }
                }
//				console.log(ret)
                ret.sort((a,b)=>{
                	return a.title.charCodeAt(0)-b.title.charCodeAt(0)
                });
				return hot.concat(ret);
			},
			selectsinger(singer){
//				console.log(singer)
//				this.setSinger('张惠妹')
                this.$router.push({
                	path:`/singer/${singer.id}`
                });
                this.setSinger(singer);
			},
			...mapMutations({
				'setSinger':"SET_SINGER"
			})
		},
		created(){
			this._getsingerlist();
		}
	}
</script>

<style scoped lang="stylus">
    .singer
        position: fixed
        top: 88px
        bottom: 0
        width: 100%
</style>