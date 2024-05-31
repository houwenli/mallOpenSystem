<template>
	<div class="page-container">
		<ws-table-el ref="table" v-bind="tableConfig" :col="8">
			<template #search>
				<search-group>
					<label for="">供应商名称：</label>
					<supplier-select
						op="listNoPage"
						:moduleName="moduleName"
						ref="supplierSelectRef"
						@supplierSelectChange="supplierSelectChange"
					></supplier-select>
				</search-group>
				<search-group>
					<label for="">供货商商品分类：</label>
					<supplier-goods-class
						ref="supplierGoodsClass"
						:supplierId="parseInt(searchOptions.thirdPlatformId)"
						op="categoryTree"
						:moduleName="moduleName"
						@supplierGoodsClassChange="supplierGoodsClassChange"
					></supplier-goods-class>
				</search-group>
			</template>
			<template #searchBtns>
				<el-button-group>
					<ws-enter-event>
						<el-button v-if="powerList.list" type="primary" icon="el-icon-search" @click="search()">
							查询
						</el-button>
					</ws-enter-event>
					<ws-throttle>
						<el-button
							v-if="powerList.list"
							type="primary"
							class="table-column-header-button"
							@click="reset"
							icon="el-icon-refresh-left"
						></el-button>
					</ws-throttle>
				</el-button-group>
				<!-- <el-button type="primary" style="margin-left: 20px" @click="batchEditMapRule">批量修改</el-button> -->
				<el-button v-if="powerList.add" type="primary" style="margin-left: 20px" @click="addMapRule">
					新建分类映射规则
				</el-button>
			</template>
			<template>
				<ws-table-column-el align="center" prop="name" label="供货商"></ws-table-column-el>
				<ws-table-column-el
					align="center"
					prop="supplierCategoryIdName1"
					label="供货商一级分类"
				></ws-table-column-el>
				<ws-table-column-el align="center" prop="wsCategoryIdName1" label="万顺一级分类"></ws-table-column-el>
				<ws-table-column-el
					align="center"
					prop="supplierCategoryIdName2"
					label="供货商二级分类"
				></ws-table-column-el>
				<ws-table-column-el align="center" prop="wsCategoryIdName2" label="万顺二级分类"></ws-table-column-el>
				<ws-table-column-el
					align="center"
					prop="supplierCategoryIdName3"
					label="供货商三级分类"
				></ws-table-column-el>
				<ws-table-column-el align="center" prop="wsCategoryIdName3" label="万顺三级分类"></ws-table-column-el>
				<ws-table-column-el align="center" prop="createTime" label="创建时间"></ws-table-column-el>
				<ws-table-column-el align="center" prop="createUserName" label="操作人"></ws-table-column-el>
				<ws-table-column-el align="center" label="操作" fixed="right">
					<template slot-scope="scope">
						<el-button
							v-if="powerList.update"
							type="text"
							style="color: #0088ff"
							@click="editMapRule(scope.row)"
						>
							编辑
						</el-button>
						<el-button v-if="powerList.delete" type="text" style="color: #0088ff" @click="del(scope.row)">
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
import SupplierGoodsClass from '@/components/SupplierGoodsClass'
export default {
	components: {
		SupplierSelect,
		SupplierGoodsClass
	},
	data() {
		return {
			moduleName: '/settle/classMappingManage',
			nameData: [],
			tableConfig: {
				filterColumns: false,
				lazyQuery: {
					moduleName: '/settle/classMappingManage',
					op: {
						selectList: 'list'
					}
				}
			},
			searchOptions: {
				thirdPlatformId: '',
				thirdPlatformCateId: ''
			},
			classifyList: {
				lazy: true,
				lazyLoad: this.lazyLoad,
				checkStrictly: true
			}
		}
	},
	methods: {
		// 表单操作
		search() {
			this.$refs.table.search()
		},
		reset() {
			this.$refs.supplierSelectRef.reset()
			this.$refs.supplierGoodsClass.reset()
			this.$refs.table.reset()
		},

		// 供应商名称选择
		supplierSelectChange(params) {
			this.searchOptions.thirdPlatformId = params.supplierValue || ''
		},

		// 供应商分类选择
		supplierGoodsClassChange(params) {
			let { supplierClass = [] } = params
			this.searchOptions.thirdPlatformCateId = supplierClass[2] || ''
		},

		// 批量修改分类映射
		batchEditMapRule() {
			let param = {
				type: 'batchEdit'
			}
			this.goMapRule(param)
		},

		// 新增分类映射
		addMapRule() {
			let param = {
				type: 'add'
			}
			this.goMapRule(param)
		},

		// 编辑分类映射
		editMapRule(row) {
			let allStepMapClass = this.getStepMapClass(row)
			let param = {
				type: 'edit',
				id: row.id,
				thirdPlatformCateId: row.thirdPlatformCateId,
				thirdPlatformId: row.thirdPlatformId,
				allStepMapClass: JSON.stringify(allStepMapClass)
			}
			this.goMapRule(param)
		},

		// 根据一行数据生成映射规则
		getStepMapClass(data) {
			return {
				step1Map: [
					{
						party: data.thirdFirstId,
						ws: data.wsFirstId
					}
				],
				step2Map: [
					{
						party: data.thirdParentId,
						ws: data.wsParentId
					}
				],
				step3Map: [
					{
						party: data.thirdPlatformCateId,
						ws: data.cateId
					}
				]
			}
		},

		// 去分类映射页面
		goMapRule(param) {
			this.$router.push({
				name: 'addClassMapping',
				query: param
			})
		},

		// 删除分类映射
		del(row) {
			this.$confirm('删除后不可恢复，确定删除吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				center: true
			})
				.then(async () => {
					let param = {
						id: row.id,
						delFlag: 1,
						op: 'delete'
					}
					try {
						let res = await this._axios(param, this.moduleName)
						if (res.code === 1) {
							this.$message.success('删除成功')
							this.search()
						}
					} catch (error) {
						console.log(error)
					}
				})
				.catch((err) => {
					console.log(err)
				})
		},
		remoteMethod() {}
	}
}
</script>

<style lang="less" scoped>
:deep(.ws-table-warp .searchBtns) {
	margin-right: 0px;
}
.page-container {
	background: #fff;
	border-radius: 8px;
	padding: 32px 40px;
	margin-bottom: 60px;
}
.down {
	background-color: #fdf0f0;
	text-align: center;
	width: 60px;
	height: 25px;
}
.up {
	background-color: #f0f9eb;
	text-align: center;
	width: 60px;
	height: 25px;
}
</style>
