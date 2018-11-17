export function shuffle(list){
	//打乱顺序 方法
	let newList=list.slice();  //复杂数据类型
	for(let i=0;i<newList.length;i++){
		let j=Math.floor(Math.random()*newList.length);  //10  随机数 0~9.999...
		let t=newList[i];
		newList[i]=newList[j];
		newList[j]=t;
	
	}
	return newList;
}


//函数节流  去抖  防止事件频繁触发导致卡顿及浏览器崩溃
//函数调用n秒后才会执行，如果函数在n秒内被调用的话则函数不执行，重新计算执行时间
export function debounce(method,delay){
	let timer=null;
	return function(...args){
		if(timer){
			clearInterval(timer);
		}
		timer=setTimeout(()=>{
			method.apply(this,args);
		},delay)
	}
}