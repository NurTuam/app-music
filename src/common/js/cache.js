import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

//保存喜爱
export function saveFavorite(song){  
    let songs=storage.get(FAVORITE_KEY,[])  
    /*逻辑是最后一次搜索的结果放到搜索历史的第一个*/  
    insertArray(songs,song,(item)=>{       
        return song.id===item.id //这是传入的一个比较函数 说明query在这个数组中  
    },FAVORITE_MAX_LEN)  
    storage.set(FAVORITE_KEY,songs)  
    return songs  
}

//删除喜爱
export function deleteFavorite(song){  
    let songs=storage.get(FAVORITE_KEY,[])  
    
    deleteArray(songs,song,(item)=>{       
        return item.id===song.id 
    })  
    storage.set(FAVORITE_KEY,songs)  
    return songs  
}
//读写数据
//添加 方法
// compare:findindex传入的是function,所以不能直接传val
function insertArray(arr,val,compare,maxLen){
	const index=arr.findIndex(compare);
	if(index===0){
		return;
	}
	if(index>0){
		arr.splice(index,1);
	}
	arr.unshift(val);  //插到数组最前面
	if(maxLen&&arr.length>maxLen){
		arr.pop();
	}
}
//删除  方法
function deleteArray(arr,compare){
	const index=arr.findIndex(compare);
	if(index>-1){
		arr.splice(index,1);
	}
}


//保存搜索
export function saveSearch(query){
	let searches=storage.get(SEARCH_KEY,[]);
	insertArray(searches,query,(item)=>{
		return item === query;
	},SEARCH_MAX_LEN)
	storage.set(SEARCH_KEY,searches);
	return searches;
}

//删除搜索
export function deleteSearch(query){
	let searches=storage.get(SEARCH_KEY,[]);
	deleteArray(searches,query,(item)=>{
		return item === query;
	})
	storage.set(SEARCH_KEY,searches);
	return searches;
}

//清空搜索
export function clearSearch(){
	storage.remove(SEARCH_KEY);
	return [];
}

// 加载本地缓存的搜索历史
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}
