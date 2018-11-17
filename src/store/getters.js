//export const singer =function(state){
//	return state.singer;
//}

//缩写
export const singer =state=>state.singer;

export const playing =state=>state.playing;

export const fullScreen =state=>state.fullScreen;

export const playList =state=>state.playList;

export const sequenceList =state=>state.sequenceList;

export const currentIndex =state=>state.currentIndex;

export const mode =state=>state.mode;

//export const currentSong = state => {
//return state.playList[state.currentIndex];
//}

export const currentSong=state=>state.playList[state.currentIndex];

export const favoriteList = state => state.favoriteList;

export const topList = state => state.topList;

export const searchHistory = state => state.searchHistory;

//import * as getters from "getters"
//
//getters={
//	singer:function(state){
//	return state.singer;
//}
