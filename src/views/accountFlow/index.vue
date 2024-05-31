<template>
	<div class="page-container">
		<ws-table-el ref="table" v-bind="tableConfig" :col="8">
			<template #search>
				<search-group>
					<label for="">供应商名称：</label>
					<supplier-select
						ref="supplierSelectRef"
						op="listNoPage"
						moduleName="/settle/accountFlow"
						@supplierSelectChange="supplierSelectChange"
					></supplier-select>
				</search-group>
			</template>
			<template #searchBtns>
				<el-button-group>
					<ws-enter-event>
						<el-button
							v-if="powerList.selectBillPage"
							type="primary"
							icon="el-icon-search"
							@click="search()"
						>
							查询
						</el-button>
					</ws-enter-event>
					<ws-throttle>
						<el-button
							v-if="powerList.selectBillPage"
							type="primary"
							class="table-column-header-button"
							icon="el-icon-refresh-left"
							@click="reset"
						></el-button>
					</ws-throttle>
				</el-button-group>
			</template>
			<template>
				<ws-table-column-el align="center" prop="name" label="供货商"></ws-table-column-el>
				<ws-table-column-el align="center" prop="rechargeAmount" label="累计充值金额">
					<template slot-scope="scope">
						{{ $baseMethod.regFenToYuan(scope.row.rechargeAmount) }}
					</template>
				</ws-table-column-el>
				<ws-table-column-el align="center" prop="availableBalance" label="可用账户余额">
					<template slot-scope="scope">
						{{ $baseMethod.regFenToYuan(scope.row.availableBalance) }}
					</template>
				</ws-table-column-el>
				<ws-table-column-el align="center" prop="expenditureAmount" label="累计支出金额">
					<template slot-scope="scope">
						{{ $baseMethod.regFenToYuan(scope.row.expenditureAmount) }}
					</template>
				</ws-table-column-el>
				<ws-table-column-el align="center" label="操作" fixed="right">
					<template slot-scope="scope">
						<el-button
							v-if="powerList.selectBillDetailPage"
							type="text"
							style="color: #0088ff"
							@click="enterForm(scope.row)"
						>
							详情
						</el-button>
					</template>
				</ws-table-column-el>
			</template>
		</ws-table-el>
	</div>
</template>

<script>
import SupplierSelect from '@/components/SupplierSelect'
import { nameList, nameMap } from './constants'
export default {
	components: {
		SupplierSelect
	},
	data() {
		return {
			moduleName: '/settle/accountFlow',
			nameList,
			nameMap,
			searchOptions: {
				name: ''
			},
			tableConfig: {
				filterColumns: false,
				lazyQuery: {
					moduleName: '/settle/accountFlow',
					op: {
						selectList: 'selectBillPage'
					}
				}
			}
		}
	},
	methods: {
		// 供应商名称选择
		supplierSelectChange(params) {
			this.searchOptions.name = params.supplierName || ''
			this.searchOptions.thirdPlatformId = params.supplierValue || ''
		},
		search() {
			this.$refs.table.search()
		},
		reset() {
			this.$refs.table.reset()
			this.$refs.supplierSelectRef.reset()
		},
		enterForm(row) {
			console.log(12345987, row)
			this.$router.push({
				name: 'accountFlowForm',
				query: {
					id: row.id,
					thirdPlatformId: row.thirdPlatformId,
					rechargeAmount: row.rechargeAmount,
					availableBalance: row.availableBalance,
					expenditureAmount: row.expenditureAmount
				}
			})
		}
	}
}
</script>

<style lang="less" scoped>
:deep(.ws-table-warp .searchBtns) {
	margin-right: 0px;
}
.page-container {
	background: #fff;
	min-height: 100%;
	border-radius: 8px;
}
</style>
