<template>
	<div class="map-wraper">
		<div class="class-tree-map">
			<p class="tree-title">
				<span class="icon"></span>
				已选
				<span class="num">{{ sourceSelect.length }}</span>
				条供应商{{ classLevelWord }}
			</p>
			<classTreeMap
				ref="source"
				@selectData="sourceSelectData"
				classType="source"
				:classData="sourceClassDataTree"
			></classTreeMap>
		</div>

		<div class="middle">
			映射至
			<img src="@/assets/images/icon_more@2x.png" />
		</div>
		<div class="class-tree-map">
			<p class="tree-title">
				<span class="icon"></span>
				已选
				<span class="num">{{ targetSelect.length }}</span>
				条万顺{{ classLevelWord }}
			</p>
			<classTreeMap
				ref="target"
				classType="target"
				:single="true"
				:sourceSelect="sourceSelect"
				nodeKey="targetId"
				:classData="targetClassDataTree"
				:reRender="targetRenderFlag"
				@selectData="targetSelectData"
				@mapTarget="mapTarget"
				@removeAllMapClass="removeAllMapClass"
				@remove="removeData"
			></classTreeMap>
		</div>
	</div>
</template>

<script>
import classTreeMap from './classTreeMap'
import { deepClone, calcTreeLevel } from '@/utils/index'
export default {
	components: {
		classTreeMap
	},
	props: {
		// 分类数据
		sourceClass: {
			type: Array,
			default: () => []
		},
		targetCLass: {
			type: Array,
			default: () => []
		},
		// 当前处于第几步
		step: {
			type: Number,
			default: 1
		},
		// 初始化的分类数据
		initStepMapClass: {
			type: Object,
			default: () => {}
		},
		// 是否是编辑，编辑时左侧树形数据不获取同级节点
		isEdit: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			sourceClassDataTree: [],
			sourceClassData: [],
			sourceSelect: [],

			targetClassDataTree: [],
			targetClassData: [],
			targetSelect: [],
			targetRenderFlag: 0,

			// 记录每一步的映射
			step0Map: [
				{
					party: 0,
					ws: 0
				}
			],
			step1Map: [],
			step2Map: [],
			step3Map: []
		}
	},
	computed: {
		classLevelWord() {
			let stepWord = ''
			switch (this.step) {
				case 1:
					stepWord = '一'
					break
				case 2:
					stepWord = '二'
					break
				case 3:
					stepWord = '三'
					break
			}
			return `${stepWord}级分类`
		}
	},
	watch: {
		step: {
			handler() {
				this.initData()
			}
			// immediate: true
		}
	},
	created() {
		if (this.initStepMapClass) {
			let { step1Map, step2Map, step3Map } = this.initStepMapClass
			this.step1Map = step1Map
			this.step2Map = step2Map
			this.step3Map = step3Map
		}
		this.initData()
	},

	methods: {
		// 初始化数据
		initData() {
			this.sourceClassData = deepClone(this.sourceClass)
			this.targetClassData = deepClone(this.targetCLass)
			// 根据前一步的映射，拼装当前需要处理的数据
			this.getCurClassData()
		},
		// 树形结构计算层级
		calcTreeLevel(tree) {
			tree.forEach((item) => {
				calcTreeLevel(item, 1)
			})
		},
		// 扁平数据转换为树形结构
		transTree(souceData, id, pid) {
			const targetData = []
			// 以每一项的id作为key,自身作为value形成对象结构
			const map = {}
			souceData.forEach((item) => {
				map[item[id]] = item
				this.$set(item, 'children', [])
			})
			// 遍历数组通过pid去匹配id,匹配到就添加到chilren属性中,匹配不到代表自身就是最外层的父节点,添加到最终的数组中
			souceData.forEach((item) => {
				if (map[item[pid]]) {
					// 匹配上
					map[item[pid]].children.push(item)
				} else {
					// 没有匹配上
					targetData.push(item)
				}
			})

			// 添加层级数据
			this.calcTreeLevel(targetData)

			// 返回的是处理之后的数组
			return targetData
		},
		// 批量获取对应值
		gatherMap(stepMap) {
			let gatherMap = stepMap.reduce(
				(prev, next) => {
					prev.partyArr.push(next.party)
					prev.wsArr.push(next.ws)
					return {
						partyArr: Array.from(new Set(prev.partyArr)),
						wsArr: Array.from(new Set(prev.wsArr))
					}
				},
				{
					partyArr: [],
					wsArr: []
				}
			)
			return gatherMap
		},
		// 根据前一步的映射，拼装当前需要处理的数据，最后拼装树形结构
		getCurClassData() {
			console.log(6666, this.step1Map, this.step2Map, this.step3Map)
			let stepMap = []
			// if (this[`step${this.step}Map`].length > 0) {
			// 	this.rebuildClassTree()
			// 	return
			// } else {
			// 	stepMap = this[`step${this.step - 1}Map`]
			// }
			stepMap = this[`step${this.step - 1}Map`]

			let gatherMap = this.gatherMap(stepMap)

			// 源数据过滤目标分类，扁平化处理
			this.sourceClassData = this.sourceClassData.filter((item) => {
				return gatherMap.partyArr.indexOf(item.parentId) > -1 || gatherMap.partyArr.indexOf(item.id) > -1
			})

			// 目标数据过滤目标分类，扁平化处理
			this.targetClassData = this.targetClassData.filter((item) => {
				return gatherMap.wsArr.indexOf(item.parentId) > -1 || gatherMap.wsArr.indexOf(item.targetId) > -1
			})

			// 如果当前步骤有映射，需要处理映射情况
			if (this[`step${this.step}Map`].length > 0) {
				this.rebuildClassTree()
				return
			}

			this.sourceClassDataTree = this.transTree(this.sourceClassData, 'id', 'parentId')
			this.targetClassDataTree = this.transTree(this.targetClassData, 'targetId', 'parentId')
		},
		// 根据已有的map映射，还原树形结构，上一步，编辑这种
		// 删除source 数组上原有节点，注入到对应target 数组的对应节点
		// 扁平化数据重新生成tree
		rebuildClassTree() {
			this.dealRebuildData()
			this.sourceClassDataTree = this.transTree(this.sourceClassData, 'id', 'parentId')
			this.targetClassDataTree = this.transTree(this.targetClassData, 'targetId', 'parentId')
		},
		// 根据step map 处理重渲染数据，目标数据增加子数据，源数据删除映射数据
		dealRebuildData() {
			let stepMap = []
			stepMap = this[`step${this.step}Map`]
			stepMap.forEach((item) => {
				this.sourceClassData.some((sourceItem, index) => {
					if (sourceItem.id === item.party) {
						// 万顺分类添加
						this.targetClassData.push({
							...sourceItem,
							parentId: item.ws,
							targetId: Math.random()
						})
						// 第三方分类删除
						this.sourceClassData.splice(index, 1)
						return true
					}
				})
			})
		},
		sourceSelectData(data) {
			this.sourceSelect = data.filter((item) => {
				return item.level !== 1
			})
			// console.log('----------sourceSelect', this.sourceSelect)
		},
		targetSelectData(data) {
			// 找到二级分类。二级分类是目标映射分类
			let level2Class = data.filter((item) => {
				return item.level === 2
			})
			if (level2Class.length > 0) {
				this.targetSelect = level2Class
			} else {
				// 没找到时，可能的情况就是只选择了3级分类，此时需要找到父分类
				let parentId = (data[0] || {}).parentId
				let targetData = deepClone(this.targetCLass)
				this.targetSelect = targetData.filter((item) => item.targetId === parentId)
			}
			// console.log('----------targetSelect', this.targetSelect)
		},
		mapTarget() {
			if (this.sourceSelect.length === 0) {
				this.$message.warning('请选择第三方分类')
				return
			}
			if (this.targetSelect.length === 0) {
				this.$message.warning('请选择万顺分类')
				return
			}
			if (this.targetSelect.length > 1) {
				this.$message.warning('只能选择一个万顺分类映射')
				return
			}
			// 只能选择一个主分类
			let stepMap = this[`step${this.step}Map`]
			if (stepMap.length > 0) {
				let wsClass = stepMap[0].ws
				let target = this.targetSelect[0] || {}
				if (target.targetId !== wsClass) {
					this.$message.warning('只能选择一个万顺分类映射')
					return
				}
			}

			this[`step${this.step}Map`] = this.getMapByClassData()
			this.initData()

			// 映射完成之后处理
			this.sourceSelect = []
			this.$refs.target.resetChecked()

			// 发射map
			this.emitMap()
		},
		// 根据classData获取map数据
		getMapByClassData() {
			let map = this[`step${this.step}Map`] || []
			this.sourceSelect.forEach((item) => {
				let target = this.targetSelect[0] || {}
				map.push({
					party: item.id,
					ws: target.targetId
				})
			})
			return map
		},
		// 全部移除映射
		removeAllMapClass() {
			// this[`step${this.step}Map`] = []
			// 发生变化把后续的映射清空
			for (let i = this.step; i <= 3; i++) {
				this[`step${i}Map`] = []
			}
			this.targetRenderFlag = Math.random()
			this.initData()
			// 发射map
			this.emitMap()
		},
		removeData(data) {
			this[`step${this.step}Map`].some((item, index) => {
				if (item.party === data.id) {
					this[`step${this.step}Map`].splice(index, 1)
					return true
				}
			})
			// 发生变化把后续的映射清空
			for (let i = this.step + 1; i <= 3; i++) {
				this[`step${i}Map`] = []
			}
			this.targetRenderFlag = Math.random()
			this.initData()
			// 发射map
			this.emitMap()
		},
		// 发射事件，把映射规则提交出去
		emitMap() {
			this.$emit('emitMap', {
				step1Map: this.step1Map,
				step2Map: this.step2Map,
				step3Map: this.step3Map
			})
		}
	}
}
</script>

<style lang="less" scoped>
.map-wraper {
	background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
	border-radius: 8px;
	padding: 24px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.class-tree-map {
		width: 43%;
		.tree-title {
			font-size: 14px;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #303133;
			line-height: 20px;
			.icon {
				width: 12px;
				height: 12px;
				background: #c0c4cc;
				border-radius: 50%;
				display: inline-block;
				margin-right: 4px;
			}
			.num {
				color: #f05259;
			}
		}
	}
	.middle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 102px;
		height: 56px;
		background: linear-gradient(270deg, #d4e5ff 0%, rgba(255, 255, 255, 0) 100%);
		border-radius: 0px 16px 16px 0px;
		font-size: 14px;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #606266;
		line-height: 20px;
		img {
			width: 16px;
			height: 16px;
			margin-left: 2px;
		}
	}
}
</style>
