<!-- 供应商名称选择 -->
<template>
	<el-select
		v-model="params.supplierValue"
		remote
		reserve-keyword
		:remote-method="remoteMethod"
		filterable
		placeholder="请选择"
		clearable
		:loading="loading"
		@change="handleChange"
	>
		<el-option v-for="item in supplierOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
	</el-select>
</template>

<script>
// import { queryOrg } from '@/api/indexconfig'
export default {
	name: 'SupplierSelectComponent',
	props: {
		op: {
			type: String,
			default: () => ''
		},
		moduleName: {
			type: String,
			default: () => ''
		},
		id: {
			type: String,
			default: () => ''
		}
	},
	data() {
		return {
			loading: false,
			params: {
				supplierName: '',
				supplierValue: ''
			},
			list: [],
			supplierOptions: []
		}
	},
	created() {
		this.init()
	},

	methods: {
		async init() {
			try {
				let param = {
					op: this.op
				}
				let res = await this._axios(param, this.moduleName)
				if (res.code === 1) {
					this.list = res.data.body
					this.supplierOptions = res.data.body
					if (this.id) {
						this.params.supplierValue = this.id * 1
					}
					this.loading = false
				}
			} catch (error) {
				console.log(error)
			}
		},
		async remoteMethod(query) {
			if (query !== '') {
				this.loading = true
				setTimeout(() => {
					this.loading = false
					this.supplierOptions = (this.list || []).filter((item) => {
						return (item.name || '').indexOf(query) > -1
					})
				}, 200)
			} else {
				this.supplierOptions = []
			}
		},
		handleChange(val) {
			let item =
				this.supplierOptions.find((item) => {
					return item.id === val
				}) || {}
			this.params = {
				supplierName: item.name || '',
				supplierValue: item.id || ''
			}
			this.$emit('supplierSelectChange', this.params)
		},
		reset() {
			this.params = {
				supplierName: '',
				supplierValue: ''
			}
		}
	}
}
</script>

<style lang="less" scoped></style>
