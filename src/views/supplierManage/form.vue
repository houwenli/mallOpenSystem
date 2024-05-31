<template>
	<div class="page-container">
		<div class="content-wrap">
			<div class="panel">
				<div class="title">基础信息</div>
				<el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px">
					<el-row>
						<el-col :span="12">
							<el-form-item label="供货商名称：" prop="name">
								<el-input
									v-model="ruleForm.name"
									placeholder="请输入公司名称"
									:disabled="type === 'detail'"
									clearable
									maxlength="64"
								></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="供货商简称：" prop="nickName">
								<el-input
									v-model="ruleForm.nickName"
									placeholder="请输入公司简称，6字以内"
									:disabled="type === 'detail'"
									clearable
									maxlength="6"
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="登录手机号：" prop="contactPhone">
								<el-input
									v-model="ruleForm.contactPhone"
									placeholder="请输入登录手机号"
									:disabled="type === 'detail'"
									clearable
									maxlength="11"
								></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="联系人：" prop="contactPerson">
								<el-input
									v-model="ruleForm.contactPerson"
									placeholder="请输入联系人姓名"
									:disabled="type === 'detail'"
									clearable
									maxlength="6"
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<div class="panel">
				<div class="title">参数配置</div>
				<el-table
					:data="tableData"
					border
					style="width: 80%"
					:header-cell-style="{ background: '#eef1f6', color: '#606266' }"
				>
					<el-table-column type="index" label="序号" width="50px"></el-table-column>
					<el-table-column align="center" prop="contacts" label="参数名称"></el-table-column>
					<el-table-column prop="contactValue" label="值">
						<template slot-scope="scope">
							<el-input
								v-model.trim="scope.row.contactValue"
								placeholder="请输入值"
								:disabled="type === 'detail'"
								clearable
								@change="limitValue(scope.row.key)"
							></el-input>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div v-if="type === 'detail'" class="panel">
				<div class="title">操作记录</div>
				<ws-table-el ref="table" v-bind="tableConfig" :col="8" :data="datalist">
					<ws-table-column-el align="center" prop="createTime" label="操作时间">
						<template slot-scope="scope">
							{{ scope.row.createTime }}
						</template>
					</ws-table-column-el>
					<ws-table-column-el align="center" prop="operatorName" label="操作人"></ws-table-column-el>
					<ws-table-column-el
						align="center"
						prop="operatorDepartment"
						label="操作人部门"
					></ws-table-column-el>
					<ws-table-column-el align="center" prop="operatorType" label="操作类型">
						<template slot-scope="scope">
							{{ createTypeMap[scope.row.operatorType] }}
						</template>
					</ws-table-column-el>
				</ws-table-el>
			</div>
		</div>
		<div class="set_btn fixed-footer">
			<el-button v-if="powerList.add" @click="back">
				{{ type === 'detail' ? '返回' : '取消' }}
			</el-button>
			<el-button v-if="type !== 'detail' && powerList.add" type="primary" @click="save">确定</el-button>
		</div>
	</div>
</template>

<script>
import { createTypeList, createTypeMap } from './constants'
export default {
	data() {
		return {
			datalist: [],
			createTypeList,
			createTypeMap,
			moduleName: '/settle/supplierManage',
			tableData: [
				{
					contacts: 'APP_key',
					contactValue: '',
					key: 'apiAppKey'
				},
				{
					contacts: 'APP_Secret',
					contactValue: '',
					key: 'apiAppSecret'
				},
				{
					contacts: '渠道API地址',
					contactValue: '',
					key: 'apiUrl'
				}
			],
			ruleForm: {
				name: '',
				nickName: '',
				contactPhone: '',
				contactPerson: ''
			},
			// 操作记录表
			tableConfig: {
				filterColumns: false,
				pagination: false,
				// lazyQuery: {
				// 	moduleName: '/settle/accountMange',
				// 	op: { selectList: 'selectOperationRecords' }
				// },
				beforeQuery: this.beforeQuery
			},
			rules: {
				name: [
					{
						required: true,
						message: '请输入公司名称',
						trigger: 'blur'
					}
				],
				nickName: [
					{
						required: true,
						message: '请输入公司简称',
						trigger: 'blur'
					}
				],
				contactPhone: [
					{
						required: true,
						message: '请输入登录手机号',
						trigger: 'blur'
					},
					{
						validator: this.checkPhone,
						trigger: 'blur'
					}
				],
				contactPerson: [
					{
						required: true,
						message: '请输入联系人',
						trigger: 'blur'
					}
				]
			}
		}
	},
	created() {
		this.type = this.$route.query.type
		this.id = this.$route.query.id
		console.log(123456, this.type)
		if (['detail', 'update'].includes(this.type)) {
			this.getDetail(this.id)
		}
	},
	methods: {
		// 校验手机号
		checkPhone(rule, value, callback) {
			let reg = /^(12[1-3]\d{8})$|^[1][3-9]\d{9}$/
			if (!reg.test(value)) {
				callback(new Error('请输入正确的手机号'))
			}
			callback()
		},
		back() {
			this.$router.push({
				name: 'supplierManage'
			})
		},
		async getDetail() {
			let param = {
				id: this.id,
				op: 'selectSupplierDetail'
			}
			try {
				let res = await this._axios(param, '/settle/supplierManage')
				if (res.code === 1) {
					let resData = res.data
					this.ruleForm = resData
					this.datalist = resData.operatorLogVoList

					this.tableData.forEach((item) => {
						item.contactValue = resData[item.key] || ''
					})

					console.log(12345678, resData)
					console.log(789654, this.tableData)
					this.search()
				}

				// console.log(987456, row.apiAppKey)
			} catch (error) {
				console.log(error)
			}
		},
		// true 校验成功，false校验失败
		limitValue(value) {
			// value存在需要单个校验
			if (value) {
				return this.checkApiValue(value)
			}
			// value不存在时就是提交时校验
			else {
				let apiParam = this.formartTableData()
				return Object.keys(apiParam).every((item) => {
					return this.checkApiValue(item)
				})
			}
		},
		// 参数配置校验
		// true 校验成功，false校验失败
		checkApiValue(value) {
			let isChinese = /^[^\u4e00-\u9fa5]*$/
			let flag = true

			let apiParam = this.formartTableData()

			switch (value) {
				case 'apiAppKey':
				case 'apiAppSecret':
					if (!apiParam[value]) {
						this.$message.error(`请输入${value === 'apiAppKey' ? 'APP_key' : 'APP_Secret'}参数配置`)
						flag = false
					} else if (!isChinese.test(apiParam[value])) {
						this.$message.error(`${value === 'apiAppKey' ? 'APP_key' : 'APP_Secret'}参数配置不能输入汉字`)
						flag = false
					} else {
						if (apiParam[value].length > 64) {
							this.$message.error('输入字符已超限，请重新输入')
							flag = false
						}
					}
					break
				case 'apiUrl':
					if (!apiParam[value]) {
						this.$message.error('请输入渠道API地址参数配置')
						flag = false
					}
					if (apiParam[value].length > 100) {
						this.$message.error('输入字符已超限，请重新输入')
						flag = false
					}
					break
			}
			return flag
		},
		checkForm() {
			let flag = true
			this.$refs['ruleForm'].validate((valid) => {
				flag = valid
			})
			return flag
		},

		formartTableData() {
			let apiParam = {}
			this.tableData.forEach((item) => {
				apiParam[item.key] = item.contactValue
			})
			return apiParam
		},
		async save() {
			console.log(789, this.tableData)

			if (!this.checkForm()) return
			if (!this.limitValue()) return

			let apiParam = this.formartTableData()

			// apiParam = {
			// 	apiAppKey:
			// 	apiAppSecret:
			// 	 apiUrl:
			// }
			let param = {
				id: this.id,
				name: this.ruleForm.name,
				nickName: this.ruleForm.nickName,
				contactPerson: this.ruleForm.contactPerson,
				contactPhone: this.ruleForm.contactPhone,
				...apiParam,
				op: this.type === 'add' ? 'add' : 'update'
			}
			if (this.type === 'add') {
				delete param.id
			}
			try {
				let res = await this._axios(param, '/settle/supplierManage')
				if (res.code === 1) {
					this.$message.success(`${this.type === 'add' ? '新增成功' : '修改成功'}`)
					this.back()
				}
			} catch (error) {
				console.log(error)
			}
		}
	}
}
</script>

<style lang="less" scoped>
.panel {
	margin-bottom: 32px;
	.title {
		font-size: 16px;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #303133;
		margin-bottom: 16px;
	}
}
.page-container {
	background: #fff;
	border-radius: 8px;
	padding: 32px 40px;
	margin-bottom: 60px;
	.content-wrap {
		min-height: calc(100vh - 250px);
	}
}
.set_btn {
	margin-top: 60px;
	text-align: center;

	&.fixed-footer {
		position: fixed;
		bottom: 0;
		left: 200px;
		right: 0;
		margin: 0;
		z-index: 100;
		padding: 14px;
		text-align: center;
		background: #fff;
		border-top: 1px solid #ebeef5;
	}

	.el-button {
		padding: 12px 65px;
	}
}
</style>
