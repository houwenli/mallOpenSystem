import vuePlugin from 'vue-plugin'
import serviceMap from '@/serviceMap'
export default {
	install(app, { store, router }) {
		app.use(vuePlugin, {
			store,
			router,
			config: {
				debug: 'VUE_APP_BASE_API',
				processEnv: process.env,
				project: {
					moduleName: process.env.VUE_APP_SYSTEM_NAME, //项目名
					type: 'system',
					service: 'VUE_APP_IMP_API', //用户中台接口服务
					jumpLink: '/rechargeSystem/index',
					systemKey: process.env.VUE_APP_SYSTEM.toUpperCase()
				},
				serviceMap
			}
		})
	}
}
