<template>
	<div class="page-container">
		<div class="content-wrap">
			<ws-descriptions v-if="Object.keys(obj).length > 0" title="商品基础信息">
				<ws-descriptions-item label="商品ID">{{ obj.id }}</ws-descriptions-item>
				<ws-descriptions-item label="商品名称">{{ obj.title }}</ws-descriptions-item>
				<ws-descriptions-item label="供货商来源">{{ obj.productSource }}</ws-descriptions-item>
				<ws-descriptions-item label="商品来源">{{ obj.sourceName }}</ws-descriptions-item>
				<ws-descriptions-item label="一级分类">{{ obj.category_1.name }}</ws-descriptions-item>
				<ws-descriptions-item label="二级分类">{{ obj.category_2.name }}</ws-descriptions-item>
				<ws-descriptions-item label="三级分类">{{ obj.category_3.name }}</ws-descriptions-item>
				<ws-descriptions-item label="上下架状态">{{ statusMap[obj.is_display] }}</ws-descriptions-item>
				<ws-descriptions-item label="商品品牌">{{ obj.brand.name || '-' }}</ws-descriptions-item>
				<ws-descriptions-item label="商品单位">{{ obj.unit }}</ws-descriptions-item>
				<ws-descriptions-item label="协议价">
					{{ $baseMethod.regFenToYuan(obj.agreement_price) + '元' }}
				</ws-descriptions-item>
				<ws-descriptions-item label="指导价">
					{{ $baseMethod.regFenToYuan(obj.guide_price) + '元' }}
				</ws-descriptions-item>
				<ws-descriptions-item label="市场价">
					{{ $baseMethod.regFenToYuan(obj.market_price) + '元' }}
				</ws-descriptions-item>
			</ws-descriptions>
			<ws-descriptions title="商品规格信息">
				<el-form ref="ruleForm" label-width="100px" label-position="right">
					<el-form-item>
						<span slot="label">商品规格：</span>
						<div v-for="(item, index) in obj.spuSpecValueVos" :key="index" class="box">
							<div>
								<p>
									规格名：
									<el-input disabled label="" :value="item.name"></el-input>
								</p>
								<p>
									规格值：
									<el-tag
										v-for="(oitem, index) in item.specValues"
										:key="index"
										style="margin-right: 20px"
									>
										{{ oitem.valueRemark }}
									</el-tag>
								</p>
							</div>
						</div>
					</el-form-item>
					<el-form-item>
						<span slot="label">规格明细：</span>
						<el-table
							:data="obj.skus"
							border
							style="width: 100%"
							:header-cell-style="{ background: '#eef1f6', color: '#606266' }"
						>
							<el-table-column label="商品编码">
								<template slot-scope="scope">
									<span>{{ scope.row.sn || '-' }}</span>
								</template>
							</el-table-column>
							<el-table-column label="商品条码">
								<template slot-scope="scope">
									<span>{{ scope.row.barcode || '-' }}</span>
								</template>
							</el-table-column>
							<!-- 根据商品规格的值来判断此处是否有值 -->
							<el-table-column
								v-for="(item, index) in obj.spuSpecValueVos"
								:key="index"
								:label="item.name"
							>
								<template slot-scope="scope">
									{{ scope.row.options[index].spec_item_name }}
								</template>
							</el-table-column>
							<el-table-column label="库存">
								<template slot-scope="scope">
									<span>{{ scope.row.stock || '-' }}</span>
								</template>
							</el-table-column>
							<el-table-column label="协议价">
								<template slot-scope="scope">
									<span>{{ $baseMethod.regFenToYuan(scope.row.price) || '-' }}</span>
								</template>
							</el-table-column>
							<el-table-column label="指导价">
								<template slot-scope="scope">
									<span>{{ $baseMethod.regFenToYuan(scope.row.guide_price) || '-' }}</span>
								</template>
							</el-table-column>
							<el-table-column label="市场价">
								<template slot-scope="scope">
									<span>{{ $baseMethod.regFenToYuan(scope.row.market_price||obj.market_price) || '-' }}</span>
								</template>
							</el-table-column>
							<el-table-column label="重量">
								<template slot-scope="scope">
									{{ scope.row.weight ? `${scope.row.weight + 'g'}` : '-' }}
								</template>
							</el-table-column>
							<el-table-column label="图片(300*300)">
								<template slot-scope="scope">
									<img
										v-if="scope.row.image_url"
										:src="scope.row.image_url"
										width="50"
										height="50"
										style="margin: 4px 0 0"
									/>
									<span v-else>-</span>
								</template>
							</el-table-column>
						</el-table>
					</el-form-item>
				</el-form>
			</ws-descriptions>
			<ws-descriptions title="商品属性">
				<el-table
					:data="obj.attrs"
					border
					style="width: 100%"
					:header-cell-style="{ background: '#eef1f6', color: '#606266' }"
				>
					<el-table-column align="center" label="属性名称" prop="name"></el-table-column>
					<el-table-column align="center" label="属性值" prop="value"></el-table-column>
				</el-table>
			</ws-descriptions>
			<ws-descriptions title="商品图文描述信息" class="img-list">
				<el-form ref="ruleForm" :model="obj" label-width="100px">
					<div class="imglists">
						<el-form-item label="">
							<div class="photo-text">主图图片</div>
							<img
								:src="obj.image_url"
								style="width: 150px; height: 150px"
								@click="onPreview(obj.image_url)"
							/>
						</el-form-item>
						<el-form-item label="">
							<div class="photo-texts">其他图片</div>
							<el-image
								v-for="(item, index) in obj.gallery"
								:key="index"
								style="width: 150px; height: 150px; margin-right: 20px"
								:src="item.src"
								:preview-src-list="[item.src]"
							></el-image>
						</el-form-item>
						<el-form-item v-if="obj.video_url" label="">
							<div class="photo-text">商品详情页首图视频</div>
							<!-- <img :src="infoData.mainVideo" @click="onPreview(infoData.mainVideo)" /> -->
							<!-- <img v-for="(img, index) in srcList" :key="index" :src="img" @click="onPreview(index)" /> -->
							<!-- poster 视频封面 autoplay  自动播放  controls 浏览器自带的控制条 -->
							<div>
								<video
									id="video"
									class="video"
									:src="obj.video_url"
									autoplay
									controls="controls"
									@click="preview()"
								>
									<source :src="obj.video_url" type="video/mp4" />
								</video>
							</div>
						</el-form-item>
						<ws-image-viewer :visible.sync="visible" :src-list="srcList" :current-index="currentIndex" />
					</div>
					<div>
						<!-- detail_images 后端返回字段 -->
						<el-form-item label="商品详情：">
							<tiny-editor
								id="tinymce"
								ref="editor"
								:menubar="false"
								:value="obj.detail_images"
								:options="options"
								disabled
							></tiny-editor>
						</el-form-item>
					</div>
				</el-form>
			</ws-descriptions>
		</div>
		<div class="set_btn fixed-footer">
			<el-button @click="back">返回</el-button>
		</div>
		<!-- 视频预览 -->
		<div v-if="flag" class="videoview">
			<i class="el-icon-circle-close" @click="pointClose"></i>
			<video :poster="obj.video_url" :src="obj.video_url" autoplay controls="controls">
				<source :src="obj.video_url" type="video/mp4" />
			</video>
		</div>
	</div>
</template>

<script>
import { statusList, statusMap } from './constants'
export default {
	components: {
		TinyEditor: () => import('@/components/tiny-editor.vue')
	},
	data() {
		return {
			moduleName: '/settle/selectionCenter',
			statusList,
			statusMap,
			obj: {},
			options: {
				statusbar: true, //状态栏
				menubar: true, //菜单栏
				toolbar: true //工具栏
			},
			visible: false,
			srcList: [],
			currentIndex: 0,
			flag: false
		}
	},
	created() {
		this.getDetail()
	},
	methods: {
		// 图片预览
		onPreview(url) {
			this.srcList = []
			this.srcList = [url]
			this.visible = true
		},
		preview() {
			this.flag = true
		},
		pointClose() {
			this.flag = false
		},
		back() {
			this.$router.push({
				name: 'selectionCenter'
			})
		},
		async getDetail() {
			let param = {
				id: parseInt(this.$route.query.id),
				op: 'view'
			}
			try {
				let res = await this._axios(param, '/settle/selectionCenter')
				if (res.code === 1) {
					this.obj = res.data.data
					this.obj.skus = this.obj.skus.map((item) => {
						let optionsDeal = item.options.map((oitem) => {
							return {
								[oitem.id]: oitem
							}
						})
						return {
							...item,
							optionsDeal
						}
					})
				}
			} catch (error) {
				console.log(error)
			}
		}
	}
}
</script>

<style lang="less" scoped>
.box {
	border: 1px solid #ebeef5;
	margin-bottom: 10px;
	padding: 24px;
	border-radius: 8px;
}
.imglists {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	// display: inline-block;
}
.img-list img {
	width: 150px;
	height: 150px;
}
.video {
	width: 150px;
	height: 150px;
}
.videoview {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 2000;
	video {
		background-color: #fff;
		width: 500px;
		cursor: grab;
	}
}
.el-icon-circle-close {
	position: fixed;
	top: 40px;
	right: 40px;
	cursor: pointer;
}
.el-icon-circle-close:before {
	content: '\e78d';
	font-weight: 400;
	font-size: 40px;
	color: #fff;
}
.el-input {
	width: 120px;
}
.photos {
	margin-right: 20px;
}
// .photo-text {
// 	width: 160px;
// 	text-align: center;
// }
// .photo-texts {
// 	width: 160px;
// 	text-align: center;
// }
</style>
