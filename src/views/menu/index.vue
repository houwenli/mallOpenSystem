<template>
	<ws-layout :routerData="routerData" v-if="showRouter">
		<template #sidebar>
			<ws-system-menu :menuData="menuList" :menuConfig="menuConfig" :routerData.sync="routerData">
				<template v-if="$showNavBar">
					<div class="logo">
						<img src="../../assets/images/logo_login.png" alt="" />
					</div>
				</template>
			</ws-system-menu>
		</template>
		<template #default>
			<transition name="fade" mode="out-in" appear>
				<keep-alive :include="alivePages">
					<router-view v-if="showRouter" />
				</keep-alive>
			</transition>
			<!-- 返回顶部按钮 -->
			<ws-backtop></ws-backtop>
		</template>
	</ws-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
	data() {
		return {
			routerData: [],
			showRouter: false,
			menuConfig: {
				textColor: '#666',
				activeBackgroundColor: 'rgb(254, 238, 238)',
				activeTextColor: '#F05259',
				backgroundColor: '#fff',
				disableTextColor: '#666666',
				hoverBackgroundColor: 'rgb(255, 243, 243)',
				hoverTextColor: 'rgb(240, 82, 89)',
				inconFontSize: '18px',
				toggleLevelA: true, //一级菜单是否可关闭开启
				defaultActiveModuleName: '/rechargeSystem/settle/serviceMange',
				uniqueOpened: true
			},
			alivePages: ['CarOwnerQuestions']
		}
	},
	computed: {
		...mapGetters('login', ['menuList']),
		subSystemInfo() {
			return this.$store.state.global && this.$store.state.global.systemConfigProject
		}
	},
	async created() {
		let userInfo = this.$baseMethod.getStore('_ccmUser') || this.$baseMethod.getCookies('WS_KEY')
		if (userInfo) {
			this.$baseMethod.setStore('_ccmUser', JSON.stringify(userInfo))
			this.$watermark.set(
				userInfo.loginName + '　' + this.$baseMethod.formatData(userInfo.loginTime, 'yyyy-MM-dd hh:mm'),
				{
					fillStyle: 'rgba(200, 200, 200, 0.1)'
				}
			)
		} else {
			this.$baseMethod.removeStore('_ccmUser')
			this.$router.replace({ name: 'login' })
		}
	},
	watch: {
		subSystemInfo: {
			immediate: true,
			handler(val) {
				this.showRouter = false
				this.getMenuList(val).then(() => {
					this.showRouter = true
				})
			}
		}
	},

	methods: {
		...mapActions('login', ['getMenuList'])
	}
}
</script>

<style lang="less">
.logo {
	text-align: center;
	margin-top: 32px;
	margin-bottom: 90px;
	img {
		width: 158px;
	}
}

.ws-table-warp .fixed_header_warp {
	top: 80px !important;
}
.table-column-header-button-refresh {
	padding: 10px 16px !important;
}
</style>
