<template>
	<div class="page-container">
		<p class="title">新建分类映射规则</p>
		<el-steps :active="step" align-center class="step-wraper">
			<el-step title="步骤1"></el-step>
			<el-step title="步骤2"></el-step>
			<el-step title="步骤3"></el-step>
		</el-steps>
		<div class="search-wraper">
			<div class="search-line">
				<search-group>
					<label for="">供应商名称：</label>
					<supplier-select
						op="listNoPage"
						:moduleName="moduleName"
						:id="$route.query.thirdPlatformId"
						ref="supplierSelectRef"
						@supplierSelectChange="supplierSelectChange"
					></supplier-select>
				</search-group>
				<el-button-group>
					<ws-enter-event>
						<el-button v-if="powerList.selectYzCategoryNoPage" type="primary" @click="search()">查询</el-button>
					</ws-enter-event>
				</el-button-group>
			</div>
		</div>
		<classMap
			v-if="targetCLass.length > 0 && sourceClass.length > 0"
			:sourceClass="sourceClass"
			:targetCLass="targetCLass"
			:initStepMapClass="initStepMapClass"
			:step="step"
			:isEdit="isEdit"
			@emitMap="mapClass"
			class="class-map"
		></classMap>
		<div v-if="targetCLass.length > 0 && sourceClass.length > 0" class="btn-wraper">
			<el-button v-if="step > 1 && powerList.add" class="default-diy1" @click="step--">上一步</el-button>
			<el-button v-show="step < 3 && powerList.add" class="default-diy" :disabled="nextDisabled" @click="step++">
				下一步
			</el-button>
			<el-button v-if="step === 3 && powerList.add" class="primary-diy" type="primary" @click="submit">
				完成，提交
			</el-button>
			<el-button v-if="step === 3 && powerList.add" class="primary-diy" type="primary" @click="submitContinueAdd">
				完成，继续新增
			</el-button>
		</div>
	</div>
</template>

<script>
import classMap from './components/classMap'
import SupplierSelect from '@/components/SupplierSelect'
import { deepClone } from '@/utils/index'
export default {
	components: {
		classMap,
		SupplierSelect
	},
	data() {
		return {
			type: '',
			moduleName: '/settle/classMappingManage',
			// 初始化的map，编辑使用
			initStepMapClass: {
				step1Map: [],
				step2Map: [],
				step3Map: []
			},
			allStepMapClass: {
				step1Map: [],
				step2Map: [],
				step3Map: []
			},
			searchOptions: {
				thirdPlatformId: ''
			},
			step: 1,
			sourceClass: [],
			// sourceClass: [
			// 	{
			// 		id: 0,
			// 		label: '全部'
			// 	},
			// 	{
			// 		id: 1,
			// 		label: '一级 1',
			// 		parentId: 0
			// 	}
			// ],
			targetCLass: []
			// targetCLass: [
			// 	{
			// 		targetId: 0,
			// 		label: '全部'
			// 	},
			// 	{
			// 		targetId: 1,
			// 		label: '万顺一级 1',
			// 		parentId: 0
			// 	}
			// ]
		}
	},
	computed: {
		nextDisabled() {
			return this.allStepMapClass[`step${this.step}Map`].length === 0
		},
		isEdit() {
			return this.type === 'edit'
		}
	},
	created() {
		this.init()
	},
	methods: {
		// 初始化
		init() {
			// 获取页面参数
			let query = this.$route.query
			console.log(query)
			this.type = query.type
			this.id = query.id || ''

			try {
				let allStepMapClass = JSON.parse(query.allStepMapClass)
				this.initStepMapClass = deepClone(allStepMapClass)
				this.allStepMapClass = deepClone(allStepMapClass)
			} catch (err) {}

			this.getWsClass()
			// 如果是编辑状态，需要查询第三方分类
			if (this.isEdit) {
				this.searchOptions.thirdPlatformId = query.thirdPlatformId
				this.getOtherClass()
			}
		},
		// 获取商家分类
		async getOtherClass() {
			let param = {
				...this.searchOptions,
				catType: this.isEdit ? 1 : 0,
				op: 'selectYzCategoryNoPage'
			}
			try {
				let res = await this._axios(param, '/settle/classMappingManage')
				if (res.code === 1) {
					let data = res.data || {}
					this.sourceClass = (data.body || []).map((item) => {
						return {
							id: parseInt(item.id),
							label: item.name,
							parentId: parseInt(item.parentId)
						}
					})

					// 后台把二级三级分类映射过的都过滤了，留下一级分类没过滤，前端处理一下
					// 先找到所有的一级分类，遍历所有分类，如果有分类的parentId等于该一级分类就留下
					this.sourceClass = this.sourceClass.filter((item) => {
						// 如果不是一级分类都保留
						// 一级做查询
						if (item.parentId !== 0) {
							return true
						} else {
							return this.sourceClass.some((serchItem) => {
								return serchItem.parentId === item.id
							})
						}
					})

					if (this.isEdit) {
						let idsArr = this.getSourceIdByEdit()
						this.sourceClass = this.sourceClass.filter((item) => {
							return idsArr.indexOf(item.id) > -1
						})
					}

					// 手动添加一个全部分类
					this.sourceClass.push({
						id: 0,
						label: '全部'
					})
				}
			} catch (error) {
				console.log(error)
			}
		},
		// 编辑状态重新组装第三方分类，获取第三方分类id
		getSourceIdByEdit() {
			let idsArr = []
			if (this.isEdit) {
				let keys = Object.keys(this.allStepMapClass)
				keys.forEach((item) => {
					this.allStepMapClass[item].forEach((third) => {
						idsArr.push(third.party)
					})
				})
			}
			return idsArr
		},

		// 获取万顺分类
		async getWsClass() {
			let param = {
				// ...this.searchOptions,
				catType: this.isEdit ? 1 : 0,
				op: 'selectWsCategoryNoPage'
			}
			try {
				let res = await this._axios(param, '/settle/classMappingManage')
				if (res.code === 1) {
					let data = res.data || {}
					this.targetCLass = (data.body || []).map((item) => {
						return {
							targetId: parseInt(item.id),
							label: item.name,
							parentId: parseInt(item.parentId)
						}
					})
					// 手动添加一个全部分类
					this.targetCLass.push({
						targetId: 0,
						label: '全部'
					})
				}
			} catch (error) {
				console.log(error)
			}
		},
		confirmSubmitData() {
			let keys = Object.keys(this.allStepMapClass)
			let flag = true
			// 检查供应商名称是否存在
			if (!this.searchOptions.thirdPlatformId) {
				flag = false
				this.$message.warning('请选择供应商')
			}
			// 检查是否所有映射存在
			keys.some((item) => {
				if (this.allStepMapClass[item].length === 0) {
					flag = false
					this.$message.warning('请完成所有映射')
					return true
				}
			})
			return flag
		},
		// 提交数据
		async doSubmit(addFlag = false) {
			if (!this.confirmSubmitData()) {
				return
			}
			// 获取构造的分类数据
			let cateList = this.formatMapClass()
			let params = {
				...this.searchOptions,
				cateList,
				op: this.isEdit ? 'update' : 'add'
			}
			if (this.isEdit) {
				params.id = this.id
			}
			try {
				let res = await this._axios(params, '/settle/classMappingManage')
				if (res.code === 1) {
					if (this.isEdit) {
						this.$message.success('编辑成功')
					} else {
						this.$message.success('添加成功')
					}
					if (addFlag) {
						// 继续新增
						this.addMapRule()
					} else {
						// 跳列表页
						this.goMapList()
					}
				}
			} catch (error) {
				console.log(error)
			}
		},
		submit() {
			this.doSubmit()
		},
		submitContinueAdd() {
			this.doSubmit(true)
		},
		// 构造提交分类数据
		// 第三方分类是唯一的，根据第三方分类构造数据
		formatMapClass() {
			let { step1Map, step2Map, step3Map } = this.allStepMapClass
			let cateList = []
			step3Map.forEach((step3) => {
				let wsCate = ''
				let thirdCate = ''
				let step3Class = this.partyFindFather(step3) || {}
				let step2 = step2Map.find((item) => item.party === step3Class.parentId)
				let step2Class = this.partyFindFather(step2) || {}
				let step1 = step1Map.find((item) => item.party === step2Class.parentId)
				if (step3 && step2 && step1) {
					thirdCate = `${step1.party}-${step2.party}-${step3.party}`
					wsCate = `${step1.ws}-${step2.ws}-${step3.ws}`
					cateList.push({
						ws: wsCate,
						third: thirdCate
					})
				}
			})
			return cateList
		},
		// 根据映射查找第三方分类
		partyFindFather(son) {
			return this.sourceClass.find((item) => item.id === son.party)
		},
		// 接收映射规则
		mapClass(data) {
			this.allStepMapClass = Object.assign({}, data)
		},
		// 供应商名称选择
		supplierSelectChange(params) {
			this.searchOptions.thirdPlatformId = params.supplierValue || ''
		},
		// 表单操作
		search() {
			this.getOtherClass()
		},
		reset() {},
		// 继续新增
		addMapRule() {
			let param = {
				type: 'add'
			}
			this.goMapRule(param)
		},
		// 去分类映射页面
		goMapRule(param) {
			this.$router.push({
				name: 'addClassMapping',
				query: param
			})
		},
		// 去列表页
		goMapList() {
			this.$router.push({
				name: 'classMappingManage'
			})
		}
	}
}
</script>

<style lang="less" scoped>
.page-container {
	padding: 24px;
}
.title {
	font-size: 16px;
	font-family: PingFangSC-Semibold, PingFang SC;
	font-weight: 600;
	color: #303133;
	line-height: 22px;
}
.step-wraper {
	margin-top: 24px;
	/deep/ .el-step {
		.is-finish {
			.el-step__icon.is-text {
				border: none;
				width: 40px;
				height: 40px;
				background: #f05259;
				font-size: 20px;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #fff;
			}
		}
		.is-process,
		.is-wait {
			.el-step__icon.is-text {
				width: 40px;
				height: 40px;
				background: #fff;
				border: 2px solid #ebeef5;
				font-size: 20px;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #c0c4cc;
				line-height: 20px;
			}
		}
		.el-step__line {
			top: 50%;
			transform: translateY(-50%);
			background-color: #dcdfe6;
		}
		.el-step__title {
			margin-top: 10px;
			font-size: 14px;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			line-height: 20px;
		}
		.el-step__title.is-finish {
			color: #606266;
		}
		.el-step__title.is-process,
		.el-step__title.is-wait {
			color: #c0c4cc;
		}
	}
}
.search-wraper {
	margin-top: 24px;
	padding: 24px;
	background: #f5f7fa;
	border-radius: 8px;
	border: 1px solid #ebeef5;
	.search-line {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
}
.class-map {
	margin-top: 17px;
}
.btn-wraper {
	text-align: center;
	margin-top: 32px;
	.default-diy {
		border: 1px solid #f05259;
		color: #f05259;
		width: 160px;
	}
	.default-diy1 {
		width: 160px;
	}
	.primary-diy {
		width: 160px;
	}
	.el-button + .el-button {
		margin-left: 19px;
	}
}
</style>
