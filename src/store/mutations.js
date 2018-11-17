import * as types from "./mutations-type";  //这个语法浏览器不支持


//types={SET_SINGER : "SET_SINGER";
//	   SET_PLAYING : "SET_PLAYING";
//	   SET_FULL_SCREEN : "SET_FULL_SCREEN";
//	   SET_PLAYLIST : "SET_PLAYLIST";
//	   SET_SEQUENCE_LIST : "SET_SEQUENCE_LIST";
//	   SET_CURRENT_INDEX : "SET_CURRENT_INDEX";
//	   SET_PLAY_MODE : "SET_PLAY_MODE";
//}



const mutations={
	list:function(state,list){
		state.faouriteList=list;
	},
	[types.SET_SINGER](state,singer){
		state.singer=singer;
	},
	[types.SET_PLAYING](state,flag){
		state.playing=flag;
	},
	[types.SET_PLAYLIST](state,list){
		state.playList=list;
	},
	[types.SET_FULL_SCREEN](state,flag){
		state.fullScreen=flag;
	},
	[types.SET_SEQUENCE_LIST](state,list){
		state.sequenceList=list;
	},
	[types.SET_CURRENT_INDEX](state,index){
		state.currentIndex=index;
	},
	[types.SET_PLAY_MODE](state,mode){
		state.mode=mode;
	},
	[types.SET_FAVORITE_LIST](state,list) {
    	state.favoriteList = list;
  	},
  	[types.SET_TOP_LIST](state, topList) {
    	state.topList = topList;
  	},
  	[types.SET_PLAYING_STATE](state, flag) {
    	state.playing = flag;
  	},
  	[types.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history;
  	}
}

export default mutations;