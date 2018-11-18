export default  {
  url : "https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp",
  	params : {
		g_tk: 5381,
		uin: 0,
		notice: 0,
		format: "jsonp",
		inCharset: "utf-8",
	  outCharset: "utf-8",
//  catZhida: zhida ? 1 : 0,
//  perpage,
    zhidaqu: 1,
    platform: "h5",
    needNewCode: 1,
    t: 0,
    flag: 1,
    ie: "utf-8",
    sem: 1,
    aggr: 0,
    uid: 0,
//  n: perpage,
//  p: page,
    remoteplace: "txt.mqq.all"
},
    ERR_OK : 0,
    callback : "jsonpCallback"
}

//export  function search(query,zhida,page,perpage){
//	
//	const url = "https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp";	
//	const params = {
//	g_tk: 5381,
//	uin: 0,
//	notice: 0,
//	format: "jsonp",
//	inCharset: "utf-8",
//	outCharset: "utf-8",
//  w: query,
//  catZhida: zhida ? 1 : 0,
//  perpage,
//  zhidaqu: 1,
//  platform: "h5",
//  needNewCode: 1,
//  t: 0,
//  flag: 1,
//  ie: "utf-8",
//  sem: 1,
//  aggr: 0,
//  uid: 0,
//  n: perpage,
//  p: page,
//  remoteplace: "txt.mqq.all"
//	};
//	
//	const ERR_OK = 0;
//	const callback = "jsonpCallback";
//}
