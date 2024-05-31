import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return routerPush.call(this, location).catch((error) => error)
}
let routes = [
	{
		path: '/',
		redirect: {
			name: 'login'
		}
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('@/views/login')
	},
	{
		path: '/settle',
		name: 'settle',
		component: () => import('@/views/menu/index.vue'),
		children: [
			{
				path: 'supplierManage',
				name: 'supplierManage',
				meta: {
					title: '供应商管理'
				},
				component: () => import('@/views/supplierManage/index.vue')
			},
			{
				path: 'supplierManage/form',
				name: 'supplierManageForm',
				meta: {
					title: '供应商管理详情'
				},
				component: () => import('@/views/supplierManage/form.vue')
			},
			{
				path: 'selectionCenter',
				name: 'selectionCenter',
				meta: {
					title: '选品中心'
				},
				component: () => import('@/views/selectionCenter/index.vue')
			},
			{
				path: 'selectionCenter/form',
				name: 'selectionCenterForm',
				meta: {
					title: '选品中心详情'
				},
				component: () => import('@/views/selectionCenter/form.vue')
			},
			{
				path: 'classMappingManage',
				name: 'classMappingManage',
				meta: {
					title: '分类映射管理'
				},
				component: () => import('@/views/classMappingManage/index.vue')
			},
			{
				path: 'classMappingManage/addClassMapping',
				name: 'addClassMapping',
				meta: {
					title: '新建分类映射'
				},
				component: () => import('@/views/classMappingManage/add.vue')
			},
			{
				path: 'accountFlow',
				name: 'accountFlow',
				meta: {
					title: '账户流水'
				},
				component: () => import('@/views/accountFlow/index.vue')
			},
			{
				path: 'accountFlow/form',
				name: 'accountFlowForm',
				meta: {
					title: '账户流水详情'
				},
				component: () => import('@/views/accountFlow/form.vue')
			}
		]
	}
]

export default routes
