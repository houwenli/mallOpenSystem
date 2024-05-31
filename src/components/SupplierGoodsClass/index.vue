<!-- 供应商商品分类 -->
<template>
	<el-cascader
		v-model="params.supplierClass"
		placeholder="请选择分类名称"
		:options="options"
		expand-trigger="hover"
		clearable
		@focus="searchClass"
		@change="handleChange"
	></el-cascader>
</template>

<script>
// import { queryOrg } from '@/api/indexconfig'
export default {
	name: 'SupplierGoodsClassComponent',
	props: {
		// 需要搭配供货商实现分类查询
		supplierId: {
			type: Number,
			default: 0
		},
		op: {
			type: String,
			default: () => ''
		},
		moduleName: {
			type: String,
			default: () => ''
		}
	},
	data() {
		return {
			cacheSupplierId: '',
			params: {
				supplierClass: ''
			},
			options: []
		}
	},
	watch: {},

	methods: {
		// 根据供货商查询分类
		async searchClass() {
			// 只有供货商存在，且发生变化时才重新查询数据
			if (this.supplierId && this.supplierId !== this.cacheSupplierId) {
				this.cacheSupplierId = this.supplierId
				try {
					let param = {
						op: this.op,
						supplierId: this.supplierId
					}
					let res = await this._axios(param, this.moduleName)
					if (res.code === 1) {
						let sourceData = (res.data || {}).body || []
						// 重新生成数据
						sourceData = sourceData.map((item) => {
							return {
								value: item.id,
								label: item.name,
								...item
							}
						})
						this.options = this.transTree(sourceData, 'id', 'parentId')
					}
				} catch (error) {
					console.log(error)
				}
			}
		},
		// 扁平数据转换为树形结构
		transTree(souceData, id, pid) {
			const targetData = []
			// 以每一项的id作为key,自身作为value形成对象结构
			const map = {}
			souceData.forEach((item) => {
				map[item[id]] = item
			})
			// 遍历数组通过pid去匹配id,匹配到就添加到chilren属性中,匹配不到代表自身就是最外层的父节点,添加到最终的数组中
			souceData.forEach((item) => {
				if (map[item[pid]]) {
					// 匹配上
					if (map[item[pid]].children) {
						map[item[pid]].children.push(item)
					} else {
						map[item[pid]].children = [item]
					}
				} else {
					// 没有匹配上
					targetData.push(item)
				}
			})

			// 返回的是处理之后的数组
			return targetData
		},
		handleChange(val) {
			this.$emit('supplierGoodsClassChange', this.params)
		},
		reset() {
			this.params = {
				supplierClass: ''
			}
		}
	}
}
</script>

<style lang="less" scoped>
.filter-item {
	display: flex;
	align-items: center;
	label {
		flex-shrink: 0;
	}
}
</style>
