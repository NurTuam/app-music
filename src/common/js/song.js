class Song{
	constructor({ id, mid,singer,name,album,duration,image,url}){
    this.id = id;
    this.mid = mid;
    this.name = name;
    this.singer=singer;
    this.name=name;
    this.album=album;
    this.duration=duration;
    this.image=image;
    this.url=url;
  }
}

function filterSinger(singer){
    let ret = [];
    if(!singer){
        return ""
    }
    singer.forEach((s)=>{
        ret.push(s.name)
    });
    return ret.join('-')
}

export default function createSong(musicData,id){
	return new Song({
		id: musicData.songid,
    	mid: musicData.songmid,
    	singer: filterSinger(musicData.singer),
    	name: musicData.songname,
    	album: musicData.albumname,
    	duration: musicData.interval,
		image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url:`http://183.60.23.16/amobile.music.tc.qq.com/C4000032ZOkm0LBgHW.m4a?guid=9779415712&vkey=7EFF7A848B939D908E0CB18DD9B3026FBA510E464110BCF29992BE049404022C4E84471337B55FE9E9D06544623ECC9A57B9DEFD0DF6CFFE&uin=0&fromtag=66`
//      url:`http://183.60.23.16/amobile.music.tc.qq.com/C400${musicData.songmid}.m4a?guid=9779415712&vkey=11FC30F594DC3E9BA38A62C891981A1B94650977F702116C9E0B3220C4AA5A2D0CD64C710BC6C38E2DCF44D07957F5D9E682475699548D6A&uin=0&fromtag=66`
	})
}
