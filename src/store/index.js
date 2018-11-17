import Vuex from "vuex"
import Vue from "vue"
import createLogger from 'vuex/dist/logger'

import state from "./state"
import mutations from "./mutations"
import * as getters from "./getters"
import * as actions from "./actions"
Vue.use(Vuex);

const debug=process.env.NODE_ENV !== 'production';
//vue.js   vuex  store  state
export default new Vuex.Store({
	state,
	mutations,
	getters,
	actions,
	strict:debug,
	plugins:debug?[createLogger()]:[]
})
