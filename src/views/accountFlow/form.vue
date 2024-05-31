<template>
	<div class="page-container">
		<div class="content-wrap">
			<div class="kuang">
				<div class="circle">
					<div>
						<span class="yue">累计充值金额（元）</span>
						<span class="money">{{ $baseMethod.regFenToYuan(moneyForm.account) }}元</span>
					</div>
				</div>
				<div class="circle">
					<div>
						<span class="yue">可用账户余额（元）</span>
						<span class="money">{{ $baseMethod.regFenToYuan(moneyForm.recharge) }}元</span>
					</div>
				</div>
				<div class="circle">
					<div>
						<span class="yue">累计支出金额（元）</span>
						<span class="money">{{ $baseMethod.regFenToYuan(moneyForm.goMoney) }}元</span>
					</div>
				</div>
			</div>
			<div class="panel">
				<div class="title">芸众账户余额流水</div>
				<ws-table-el ref="table" v-bind="tableConfig" :col="8">
					<template #search>
						<search-group>
							<label for="">变动时间：</label>
							<ws-date-range
								:start-time.sync="searchOptions.times"
								:end-time.sync="searchOptions.timee"
							></ws-date-range>
						</search-group>
						<search-group>
							<label for="">变动科目：</label>
							<el-select v-model="searchOptions.business_type" clearable>
								<el-option
									v-for="item in changeType"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
						</search-group>
					</template>
					<template #searchBtns>
						<el-button-group>
							<ws-enter-event>
								<el-button
									v-if="powerList.selectBillDetailPage"
									type="primary"
									icon="el-icon-search"
									@click="search()"
								>
									查询
								</el-button>
							</ws-enter-event>
							<ws-throttle>
								<el-button
									v-if="powerList.selectBillDetailPage"
									type="primary"
									class="table-column-header-button"
									icon="el-icon-refresh-left"
									@click="reset"
								></el-button>
							</ws-throttle>
						</el-button-group>
					</template>
					<template>
						<ws-table-column-el align="center" prop="pay_sn" label="支付号"></ws-table-column-el>
						<ws-table-column-el align="center" prop="business_type" label="变动科目">
							<template slot-scope="scope">
								{{ changeTypeMap[scope.row.business_type] || '-' }}
							</template>
						</ws-table-column-el>
						<ws-table-column-el align="center" prop="amount" label="支出/收入">
							<template slot-scope="scope">
								{{ $baseMethod.regFenToYuan(scope.row.amount) }}
							</template>
						</ws-table-column-el>
						<ws-table-column-el align="center" prop="createTime" label="变动时间"></ws-table-column-el>
						<ws-table-column-el align="center" prop="remarks" label="备注">
							<template slot-scope="scope">
								{{ scope.row.remarks || '-' }}
							</template>
						</ws-table-column-el>
					</template>
				</ws-table-el>
			</div>
		</div>
	</div>
</template>

<script>
import { changeTypeList, changeTypeMap } from './constants'
export default {
	data() {
		return {
			changeTypeList,
			changeTypeMap,
			moduleName: '/settle/accountFlow',
			changeType: [
				{
					label: '余额充值',
					value: 4
				},
				{
					label: '余额退款',
					value: 5
				},
				{
					label: '余额采购',
					value: 2
				}
			],
			moneyForm: {
				account: '',
				recharge: '',
				goMoney: ''
			},
			searchOptions: {
				times: '',
				timee: '',
				business_type: '',
				pay_sn: '',
				id: this.$route.query.thirdPlatformId
			},
			tableConfig: {
				filterColumns: false,
				lazyQuery: {
					moduleName: '/settle/accountFlow',
					op: {
						selectList: 'selectBillDetailPage'
					},
					beforeQuery: this.beforeQuery
				}
			}
		}
	},
	created() {
		this.getChangeType()
		this.moneyForm.account = this.$route.query.rechargeAmount
		this.moneyForm.recharge = this.$route.query.availableBalance
		this.moneyForm.goMoney = this.$route.query.expenditureAmount
	},
	methods: {
		async getChangeType() {
			let param = {
				op: 'selectBillTypeList',
				pageSize: 20,
				currentPage: 1,
				body: {
					times: null,
					timee: null,
					business_type: null,
					pay_sn: null,
					id: this.$route.query.thirdPlatformId
				}
			}
			try {
				let res = await this._axios(param, '/settle/accountFlow')
				console.log(34567, res)
				if (res.code === 1) {
					// this.changeType = (res.data.body || []).map((item) => {
					// 	return {
					// 		label: item.name,
					// 		value: item.value
					// 	}
					// })
				}
			} catch (error) {
				console.log(error)
			}
		},
		beforeQuery() {
			return this.searchOptions
		},
		search() {
			this.$refs.table.search()
		},
		reset() {
			this.$refs.table.reset()
		}
	}
}
</script>

<style lang="less" scoped>
.page-container {
	background: #fff;
	border-radius: 8px;
	padding: 32px 40px;
	margin-bottom: 60px;
}
.panel {
	margin-bottom: 32px;
	margin-top: 32px;
	.title {
		font-size: 16px;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #303133;
		margin-bottom: 16px;
	}
}
.kuang {
	display: flex;
	justify-content: space-between;
}
.circle {
	width: 100%;
	height: 180px;
	border: 1px solid #ebeef5;
	border-radius: 8px;
	margin-right: 10px;
	text-align: center;
	box-shadow: 0 5px 16px 0 hsla(0, 0%, 72.9%, 0.2);
}
.yue {
	display: block;
	line-height: 22px;
	margin-top: 60px;
	font-size: 16px;
}
.money {
	display: block;
	height: 56px;
	font-size: 28px;
	font-weight: 700;
	margin: 10px;
}
:deep(.ws-table-warp .searchBtns) {
	margin-right: 0px;
}
</style>
