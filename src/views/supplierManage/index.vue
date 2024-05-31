<template>
	<div class="page-container">
		<ws-table-el ref="table" v-bind="tableConfig" :col="8">
			<template #search>
				<search-group>
					<label for="">供应商名称：</label>
					<supplier-select
						ref="supplierSelectRef"
						op="selectPull"
						moduleName="/settle/supplierManage"
						@supplierSelectChange="supplierSelectChange"
					></supplier-select>
				</search-group>
				<search-group>
					<label for="">状态：</label>
					<el-select v-model="searchOptions.status" placeholder="请选择" clearable>
						<el-option v-for="(item, key) in statusMap" :key="key" :label="item" :value="key"></el-option>
					</el-select>
				</search-group>
			</template>
			<template #searchBtns>
				<el-button-group>
					<ws-enter-event>
						<el-button
							v-if="powerList.selectSupplierPage"
							type="primary"
							icon="el-icon-search"
							@click="search()"
						>
							查询
						</el-button>
					</ws-enter-event>
					<ws-throttle>
						<el-button
							v-if="powerList.selectSupplierPage"
							type="primary"
							class="table-column-header-button"
							@click="reset"
							icon="el-icon-refresh-left"
						></el-button>
					</ws-throttle>
				</el-button-group>
				<el-button v-if="powerList.add" type="primary" style="margin-left: 20px" @click="enterForm('add')">
					新增
				</el-button>
			</template>
			<template>
				<ws-table-column-el align="center" prop="id" label="供货商ID"></ws-table-column-el>
				<ws-table-column-el align="center" prop="name" label="供货商名称"></ws-table-column-el>
				<ws-table-column-el align="center" prop="apiUrl" label="渠道API地址"></ws-table-column-el>
				<ws-table-column-el align="center" prop="contactPhone" label="登录手机号"></ws-table-column-el>
				<ws-table-column-el align="center" prop="contactPerson" label="联系人"></ws-table-column-el>
				<ws-table-column-el align="center" prop="status" label="状态">
					<template slot-scope="scope">
						<span v-if="scope.row.status == 1">停用</span>
						<span v-if="scope.row.status == 0">启用</span>
					</template>
				</ws-table-column-el>
				<ws-table-column-el align="center" prop="createTime" label="创建时间"></ws-table-column-el>
				<ws-table-column-el align="center" label="操作" fixed="right">
					<template slot-scope="scope">
						<el-button
							v-if="powerList.selectSupplierDetail"
							type="text"
							style="color: #0088ff"
							@click="enterForm('detail', scope.row.id)"
						>
							详情
						</el-button>
						<el-button
							v-if="powerList.update"
							type="text"
							style="color: #0088ff"
							@click="enterForm('update', scope.row.id)"
						>
							修改
						</el-button>
						<el-button
							v-if="powerList.update"
							type="text"
							style="color: #0088ff"
							@click="openState(scope.row)"
						>
							{{ `${scope.row.status == 1 ? '启用' : '停用'}` }}
						</el-button>
						<el-button
							v-if="scope.row.status == 1 && powerList.update"
							type="text"
							style="color: #0088ff"
							@click="deleted(scope.row)"
						>
							删除
						</el-button>
					</template>
				</ws-table-column-el>
			</template>
		</ws-table-el>
	</div>
</template>

<script>
import SupplierSelect from '@/components/SupplierSelect'
import { nameList, nameMap, statusList, statusMap } from './constants'
export default {
	components: {
		SupplierSelect
	},
	data() {
		return {
			nameList,
			nameMap,
			statusList,
			statusMap,
			moduleName: '/settle/supplierManage',
			searchOptions: {
				name: '',
				status: ''
			},
			tableConfig: {
				filterColumns: false,
				lazyQuery: {
					moduleName: '/settle/supplierManage',
					op: {
						selectList: 'selectSupplierPage'
					}
				}
			}
		}
	},
	methods: {
		// 供应商名称选择
		supplierSelectChange(params) {
			this.searchOptions.name = params.supplierName || ''
			this.searchOptions.id = params.supplierValue || ''
		},
		search() {
			this.$refs.table.search()
		},
		reset() {
			this.$refs.table.reset()
			this.$refs.supplierSelectRef.reset()
		},
		// 启用、停用
		openState(row) {
			this.$confirm(
				`${row.status === 1 ? '确定启用该供应商吗？' : '停用后，供应商商品会全部下架，确定停用吗？'}`,
				`${row.status === 0 ? '停用' : '启用'}`,
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					center: true
				}
			).then(async () => {
				let param = {
					id: row.id + '',
					status: row.status === 0 ? 1 : 0,
					op: 'update'
				}
				try {
					let res = await this._axios(param, '/settle/supplierManage')
					if (res.code === 1) {
						this.$message.success(`${row.status === 0 ? '停用' : '启用'}成功`)
						this.search()
					}
				} catch (error) {
					console.log(error)
				}
			})
		},
		// 删除
		deleted(row) {
			this.$confirm('删除后不可恢复，确定删除吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				center: true
			}).then(async () => {
				let param = {
					id: row.id + '',
					delFlag: row.delFlag === 0 ? 1 : 0,
					op: 'update'
				}
				try {
					let res = await this._axios(param, '/settle/supplierManage')
					if (res.code === 1) {
						this.$message.success('删除成功')
						this.search()
					}
				} catch (error) {
					console.log(error)
				}
			})
		},
		enterForm(type, id) {
			let param = {
				type,
				id: id + ''
			}
			if (type === 'add') {
				delete param.id
			}
			this.$router.push({
				name: 'supplierManageForm',
				query: param
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
