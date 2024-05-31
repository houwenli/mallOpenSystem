<template>
	<div class="page-container">
		<ws-table-el ref="table" v-bind="tableConfig" :col="8" @selection-change="selectDatalist">
			<template #search>
				<search-group>
					<label for="">供应商名称：</label>
					<supplier-select
						ref="supplierSelectRef"
						op="listNoPage"
						moduleName="/settle/selectionCenter"
						@supplierSelectChange="supplierSelectChange"
					></supplier-select>
				</search-group>
				<search-group>
					<label for="">上下架状态：</label>
					<el-select v-model="searchOptions.is_display" placeholder="请选择" clearable>
						<el-option label="上架" :value="1"></el-option>
						<el-option label="下架" :value="0"></el-option>
					</el-select>
				</search-group>
				<search-group>
					<label for="">供货商商品分类：</label>
					<supplier-goods-class
						ref="supplierGoodsClass"
						:supplierId="searchOptions.id"
						op="categoryTree"
						:moduleName="moduleName"
						@supplierGoodsClassChange="supplierGoodsClassChange"
					></supplier-goods-class>
				</search-group>
				<search-group>
					<label for="">是否包邮：</label>
					<el-select v-model="searchOptions.freight_type" placeholder="请选择" clearable>
						<el-option label="是" :value="1"></el-option>
						<el-option label="否" :value="2"></el-option>
					</el-select>
				</search-group>
			</template>
			<template #searchBtns>
				<el-button-group>
					<ws-enter-event>
						<el-button v-if="powerList.selectPage" type="primary" icon="el-icon-search" @click="search()">
							查询
						</el-button>
					</ws-enter-event>
					<ws-throttle>
						<el-button
							v-if="powerList.selectPage"
							type="primary"
							class="table-column-header-button"
							icon="el-icon-refresh-left"
							@click="reset"
						></el-button>
					</ws-throttle>
				</el-button-group>
				<el-button v-if="powerList.addProduct" type="primary" style="margin-left: 20px" @click="exportFile">
					批量导入商品
				</el-button>
			</template>
			<template>
				<ws-table-column-el type="selection" fixed="left"></ws-table-column-el>
				<ws-table-column-el align="center" prop="image_url" label="商品主图">
					<template slot-scope="scope">
						<img :src="scope.row.image_url" width="50" height="50" style="margin: 4px 0 0" />
					</template>
				</ws-table-column-el>
				<ws-table-column-el align="center" prop="id" label="商品id"></ws-table-column-el>
				<ws-table-column-el align="center" prop="title" label="商品名称" width="240px"></ws-table-column-el>
				<ws-table-column-el align="center" prop="is_display" label="上下架状态">
					<template slot-scope="scope">
						<el-tag type="success" v-if="scope.row.is_display == 1">上架</el-tag>
						<el-tag type="danger" v-if="scope.row.is_display == 0">下架</el-tag>
					</template>
				</ws-table-column-el>
				<ws-table-column-el align="center" prop="category_1_Name" label="一级分类"></ws-table-column-el>
				<ws-table-column-el align="center" prop="category_2_Name" label="二级分类"></ws-table-column-el>
				<ws-table-column-el align="center" prop="category_3_Name" label="三级分类"></ws-table-column-el>
				<ws-table-column-el align="center" prop="agreement_price" label="协议价">
					<template slot-scope="scope">
						{{ $baseMethod.regFenToYuan(scope.row.agreement_price) }}
					</template>
				</ws-table-column-el>
				<ws-table-column-el align="center" prop="guide_price" label="指导价">
					<template slot-scope="scope">
						{{ $baseMethod.regFenToYuan(scope.row.guide_price) }}
					</template>
				</ws-table-column-el>
				<ws-table-column-el align="center" prop="market_price" label="市场价">
					<template slot-scope="scope">
						{{ $baseMethod.regFenToYuan(scope.row.market_price) }}
					</template>
				</ws-table-column-el>
				<ws-table-column-el align="center" prop="origin_rate" label="常规利润率">
					<template slot-scope="scope">
						{{ scope.row.origin_rate + '%' }}
					</template>
				</ws-table-column-el>
				<ws-table-column-el align="center" prop="supplier_name" label="供货商名称">
					<template slot-scope="scope">
						{{ scope.row.supplier_name || '-' }}
					</template>
				</ws-table-column-el>
				<ws-table-column-el align="center" prop="freight_type" label="是否包邮">
					<template slot-scope="scope">
						<span v-if="scope.row.freight_type === 3">是</span>
						<span v-else-if="[0, 1, 2].indexOf(scope.row.freight_type) > -1">否</span>
						<span v-else>-</span>
					</template>
				</ws-table-column-el>
				<ws-table-column-el align="center" label="操作" fixed="right">
					<template slot-scope="scope">
						<el-button
							v-if="powerList.view"
							type="text"
							style="color: #0088ff"
							@click="enterForm(scope.row.id)"
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
import SupplierGoodsClass from '@/components/SupplierGoodsClass'
export default {
	components: {
		SupplierSelect,
		SupplierGoodsClass
	},
	data() {
		return {
			moduleName: '/settle/selectionCenter',
			nameData: [],
			selections: [],
			tableConfig: {
				filterColumns: false,
				lazyQuery: {
					moduleName: '/settle/selectionCenter',
					op: {
						selectList: 'selectPage'
					}
				}
			},
			searchOptions: {
				supplier_name: '',
				is_display: '',
				class: '',
				freight_type: '',
				id: 0,
				name: ''
			},
			classifyList: {
				lazy: true,
				lazyLoad: this.lazyLoad,
				checkStrictly: true
			}
		}
	},
	methods: {
		// 供应商名称选择
		supplierSelectChange(params) {
			this.searchOptions.name = params.supplierName || ''
			this.searchOptions.id = params.supplierValue || ''
		},
		// 供应商分类选择
		supplierGoodsClassChange(params) {
			let supplierClass = params.supplierClass || []
			this.searchOptions.category_1_id = supplierClass[0] || ''
			this.searchOptions.category_2_id = supplierClass[1] || ''
			this.searchOptions.category_3_id = supplierClass[2] || ''
		},
		enterForm(id) {
			console.log(123456, id)
			this.$router.push({
				name: 'selectionCenterForm',
				query: {
					id
				}
			})
		},
		search() {
			this.$refs.table.search()
		},
		reset() {
			this.$refs.supplierSelectRef.reset()
			this.$refs.table.reset()
			this.$refs.supplierGoodsClass.reset()
		},
		selectDatalist(val) {
			this.selections = val
		},
		// 批量导入
		async exportFile() {
			if (!this.selections.length) return this.$message.warning('请先勾选至少一条表格数据')
			let param = {
				ids: this.selections.map((item) => item.id),
				op: 'addProduct'
			}
			try {
				let res = await this._axios(param, '/settle/selectionCenter')
				if (res.code === 1) {
					console.log(56987, res)
					console.log(67654, this.selections.length)
					this.$message.success(
						`导入成功${res.data.data.successNumber}条数据,导入失败${res.data.data.failNumber}条数据`
					)
					setTimeout(this.search, 2000)
				}
			} catch (error) {
				console.log(error)
			}
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
	border-radius: 8px;
	padding: 32px 40px;
	margin-bottom: 60px;
}
</style>
