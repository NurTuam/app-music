// 0. 如果使用模块化机制编程，导入Vue和VueRouter，要调用 Vue.use(VueRouter)
import Vue from "vue";
import VueRouter from "vue-router";

// 1. 定义 (路由) 组件
import Rank from "../components/rank/rank"
import Recommend from "../components/recommend/recommend"
import Singer from "../components/singer/singer"
import Search from "../components/search/search"
import SingerDetail from "../components/singerDetail/singerDetail"
import RankDetail from "../components/rankDetail/rankDetail"

Vue.use(VueRouter);


// 2. 定义路由:每个路由应该映射一个组件。
const routes = [
    { path:'/',redirect:'/recommend'},
    { path: '/recommend', component: Recommend },
    { path: '/rank', 
        component: Rank,
        children:[
            {
            	path:":id",
            	component:RankDetail
            }
        ] },
    { path: '/singer', 
    	component: Singer,
    	children:[
    		{
    			path:":id",
    			component:SingerDetail
    		}
    	] },
    { path: '/search', 
    	component: Search,
    	children:[
    	    {
    	        path:":id",
    	        component:SingerDetail
    	    }
    	] },
];
// 3. 创建 router 实例，然后传 `routes` 配置
export default new VueRouter({
    routes
});


