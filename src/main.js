import './public-path'
import Vue from 'vue'
import App from './App.vue'
import routes from './router/index'
import store from './store'
import ElementUI from 'element-ui'
import common from './qiankun-common'
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css'
import 'vue-plugin/lib/static/css/theme-red/index.css'
import vuePlugin from './plugins/vue-plugin'
import './assets/css/base.less'
import Footer from '@/components/Footer/index.vue'
import serviceMap from './serviceMap.js'
import _axios from './utils/http.js'

Vue.use(VueRouter)
const routerPush = VueRouter.prototype.push

Vue.prototype._axios = _axios
VueRouter.prototype.push = function push(location) {
	return routerPush.call(this, location).catch((error) => error)
}
Vue.prototype.inputFun = function inputFun(val, filed, msg) {
	let reg = /^[0-9]*$/
	if (val && !reg.test(val)) {
		this.searchOptions[filed] = ''
		this.$message.warning(`${msg}只能输入数字`)
	}
}
Vue.config.productionTip = false
Vue.prototype.$showNavBar = true

Vue.use(ElementUI, {
	size: 'medium'
})

//微应用配置
let instance = null
let router = null

function creatVueRouter() {
	return new VueRouter({
		mode: 'history',
		base: '/' + process.env.VUE_APP_SYSTEM,
		routes
	})
}
router = creatVueRouter()
Vue.use(vuePlugin, {
	router,
	store,
	config: {
    debug: 'VUE_APP_BASE_API',
    serviceMap
	}
})

Vue.component('WsFooter', Footer)

function render(props = {}) {
	const { container } = props
	if (window.__POWERED_BY_QIANKUN__ && window.__CACHE_INSTANCE_BY_QIAN_KUN_FOR_VUE__) {
		const cachedInstance = window.__CACHE_INSTANCE_BY_QIAN_KUN_FOR_VUE__
		router = creatVueRouter()
		// 从最初的Vue实例上获得_vnode
		const cachedNode = cachedInstance._vnode

		// 让当前路由在最初的Vue实例上可用
		router.apps.push(...cachedInstance.catchRoute.apps)

		instance = new Vue({
			router,
			store,
			render: () => cachedNode
		})

		// 缓存最初的Vue实例
		instance.cachedInstance = cachedInstance

		instance.$mount(
			container ? container.querySelector('#recharge-business-system-app') : '#recharge-business-system-app'
		)
	} else {
		instance = new Vue({
			router,
			store,
			render: (h) => h(App)
		}).$mount(
			container ? container.querySelector('#recharge-business-system-app') : '#recharge-business-system-app'
		)
	}
	window.$vm = instance

	// vue子应用devtool调试
	if (process.env.NODE_ENV !== 'production' && window.__POWERED_BY_QIANKUN__) {
		let instanceDiv = document.createElement('div')
		instanceDiv.id = 'recharge-business-system-app-debug'
		instanceDiv.__vue__ = instance
		document.body.appendChild(instanceDiv)
	}
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
	console.log('独立运行')
	render()
}

export async function bootstrap(props) {}

export async function mount(props) {
	console.log(`[qiankun-mount]-${process.env.VUE_APP_SYSTEM_NAME}-mount`)
	const { mainStore, mainRoute } = props

	Vue.prototype.$mainStore = mainStore
	Vue.prototype.$mainRoute = mainRoute
	Vue.prototype.$showNavBar = props.subSystemNavbarStatus.showNavBar

	// 单入口 可能需要注释掉下面的 onGlobalStateChange
	Vue.prototype.$onGlobalStateChange = props.onGlobalStateChange
	Vue.prototype.$onGlobalStateChange((state) => {
		store.commit('global/setGlobalState', { ...state })
	})

	common.initGlobalState(store, props)

	render(props)
}

export async function unmount() {
	console.log(`[qiankun-${process.env.VUE_APP_SYSTEM_NAME}-unmount]`)
	const cachedInstance = instance.cachedInstance || instance
	window.__CACHE_INSTANCE_BY_QIAN_KUN_FOR_VUE__ = cachedInstance
	const cachedNode = cachedInstance._vnode
	if (!cachedNode.data.keepAlive) cachedNode.data.keepAlive = true
	cachedInstance.catchRoute = {
		apps: [...instance.$router.apps]
	}
	instance.$destroy()
	router = null
	instance.$router.apps = []
}
