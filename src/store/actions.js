import * as types from "./mutations-type";
import {playMode} from "../common/js/config";
import {shuffle} from "../common/js/util";
import {saveSearch, deleteSearch, clearSearch, saveFavorite,deleteFavorite} from "../common/js/cache";
import {findIndex} from "../common/js/findIndex";

export const selectPlay=function({commit},{list,index}){
	commit(types.SET_PLAYING,true);
	commit(types.SET_FULL_SCREEN,true);
	commit(types.SET_PLAYLIST,list);
	commit(types.SET_SEQUENCE_LIST,list); //这里是同一个列表
	commit(types.SET_CURRENT_INDEX,index);
	// 设置播放状态 播放 or 暂停
  	commit(types.SET_PLAYING_STATE,true);
}

export const randomPlay=function({commit},{list}){
	commit(types.SET_PLAY_MODE,playMode.random);
	commit(types.SET_SEQUENCE_LIST,list);  
	let randomList=shuffle(list);   //打乱顺序
	commit(types.SET_PLAYLIST,randomList);   //跟上面的是不同的列表
	commit(types.SET_CURRENT_INDEX,0);
	commit(types.SET_PLAYING,true);
	commit(types.SET_FULL_SCREEN,true);  //为true所以全屏啦
	// 设置播放状态 播放 or 暂停
  	commit(types.SET_PLAYING_STATE,true);
}

//删除播放列表的歌曲
export const deleteSong=function({commit,state},song){
	let playlist=state.playList.slice();           //正常播放列表下标
	let sequenceList=state.sequenceList.slice();  //顺序播放列表下标
	let currentIndex=state.currentIndex;  //当前歌曲
	let pIndex=findIndex(playlist,song);
	playlist.splice(pIndex,1);
	let sIndex=findIndex(sequenceList,song);
	sequenceList.splice(sIndex,1);
	
	//判断 设置currentIndex的值
	if(currentIndex>pIndex || currentIndex==playlist.length){
		currentIndex--;
	}
	
	const playingState=playlist.length>0;
	
	commit(types.SET_PLAYLIST,playlist);
	commit(types.SET_SEQUENCE_LIST,sequenceList);
	commit(types.SET_CURRENT_INDEX,currentIndex);
	commit(types.SET_PLAYING_STATE,playingState);
}


//清空播放列表
export const deleteSongList=function({commit}){
	commit(types.SET_CURRENT_INDEX,0);
	commit(types.SET_PLAYLIST,[]);
	commit(types.SET_SEQUENCE_LIST,[]);
}

//保存喜爱歌曲列表
export const saveFavoriteList = function({commit},song) {
	commit(types.SET_FAVORITE_LIST, saveFavorite(song));
}
//删除喜爱歌曲列表
export const deleteFavoriteList = function({commit},song) {
	commit(types.SET_FAVORITE_LIST, deleteFavorite(song));
}

//存储搜索历史
export const saveSearchHistory=function({commit},query){
	commit(types.SET_SEARCH_HISTORY,saveSearch(query));
}
//删除搜索历史
export const deleteSearchHistory=function({commit},query){
	commit(types.SET_SEARCH_HISTORY,deleteSearch(query));
}
//清空搜索历史
export const clearSearchHistory=function({commit}){
	commit(types.SET_SEARCH_HISTORY,clearSearch());
}
