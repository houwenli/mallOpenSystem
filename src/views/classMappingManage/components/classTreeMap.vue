<template>
	<div>
		<div class="tree-wraper">
			<div class="box" v-if="single"></div>
			<el-input v-model="filterText" placeholder="请选择商品分类" class="search-word"></el-input>

			<el-tree
				v-if="show"
				ref="tree"
				class="filter-tree"
				:data="classData"
				:props="defaultProps"
				default-expand-all
				:filter-node-method="filterNode"
				show-checkbox
				:node-key="nodeKey"
				@check="treeNodeClick"
			>
				<div
					slot-scope="{ node, data }"
					class="custom-tree-node"
					:class="data.id && classType == 'target' ? 'custom-tree-node-bg' : ''"
				>
					<span>{{ node.label }}</span>
					<template v-if="data.id && classType == 'target'">
						<img src="@/assets/images/icon_off@2x.png" @click="() => remove(data)" />
					</template>
				</div>
			</el-tree>
			<div v-if="classType == 'source'">
				<el-button class="default-diy" @click="selectAll">全选</el-button>
				<!-- <el-button type="primary" @click="resetChecked">清空</el-button> -->
			</div>
			<div v-if="classType == 'target'">
				<el-button type="primary" @click="mapTargetClass">映射至该分类</el-button>
				<!-- <el-button type="primary" @click="selectAll">全选映射分类</el-button> -->
				<el-button class="default-diy" @click="removeAllMapClass">全部移除</el-button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		// 映射类型
		classType: {
			type: String,
			default: 'source' // source：源数据，target：目标数据
		},
		// 是否单选
		single: {
			type: Boolean,
			default: false
		},
		// 分类数据
		classData: {
			type: Array,
			default: () => {}
		},
		nodeKey: {
			type: String,
			default: 'id'
		},
		expandedKeys: {
			type: Array,
			default: () => []
		},
		// 是否需要重新渲染
		reRender: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			show: true,
			filterText: '',
			defaultProps: {
				children: 'children',
				label: 'label'
			},
			currentCheckData: {}
		}
	},
	watch: {
		filterText(val) {
			this.$refs.tree.filter(val)
		},
		reRender() {
			this.show = false
			this.$nextTick(() => {
				this.show = true
			})
		}
	},

	methods: {
		filterNode(value, data) {
			if (!value) return true
			return data.label.indexOf(value) !== -1
		},
		selectAll() {
			this.$refs.tree.setCheckedNodes(this.classData)
			this.$emit('selectData', this.$refs.tree.getCheckedNodes())
		},
		resetChecked() {
			this.$refs.tree.setCheckedKeys([])
			this.$emit('selectData', [])
		},
		treeNodeClick(data) {
			// 单选
			if (this.single) {
				this.$refs.tree.setCheckedKeys([data[this.nodeKey]])
			}
			this.$emit('selectData', this.$refs.tree.getCheckedNodes())
		},
		mapTargetClass() {
			this.$emit('mapTarget')
		},
		removeAllMapClass() {
			this.$emit('removeAllMapClass')
		},
		remove(data) {
			this.$emit('remove', data)
		}
	}
}
</script>

<style lang="less" scoped>
.custom-tree-node {
	width: 100%;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 10px;
}
.custom-tree-node img {
	width: 18px;
	height: 18px;
}
.custom-tree-node-bg {
	background-color: #f5f7fa;
}
.tree-wraper {
	background: #ffffff;
	border-radius: 4px;
	border: 1px solid #dcdfe6;
	padding: 15px;
	margin-top: 13px;
	position: relative;
	.box {
		width: 24px;
		height: 24px;
		position: absolute;
		left: 39px;
		top: 77px;
		z-index: 99;
	}
	.search-word {
		width: 100%;
		height: 40px;
		background: #ffffff;
		border-radius: 4px;
		/deep/ .el-input__inner {
			box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06);
		}
	}
	.filter-tree {
		margin-top: 16px;
		height: 395px;
		overflow-y: auto;
		/deep/ .el-tree-node {
			.el-tree-node__content {
				height: 36px;
			}
			.el-checkbox__inner {
				width: 20px;
				height: 20px;
			}
			.el-checkbox__inner::after {
				height: 10px;
				left: 8px;
				top: 2px;
			}
			.el-checkbox__inner::before {
				top: 8px;
			}
		}
	}
}
.default-diy {
	border: 1px solid #f05259;
	color: #f05259;
}
.el-button + .el-button {
	margin-left: 12px;
}
</style>
