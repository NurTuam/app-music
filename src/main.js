import "babel-polyfill"

import Vue from 'vue'
import App from './App'
import Vueresource from 'vue-resource'
import VueLazyload from 'vue-lazyload'
import router from './router/index.js'

import './common/stylus/index.styl'
import store from "./store/index"

Vue.use(Vueresource)
Vue.use(VueLazyload,{
	loading:require("./common/images/default.png")
});


new Vue({
  el: '#app',
  router,
  store,
  render:h=>h(App)
})
