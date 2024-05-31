<template>
	<div>
		<editor v-model="contentTxt" :init="editorInit" :disabled="disabled"></editor>
	</div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/modern/theme'
import editor from '@tinymce/tinymce-vue'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/link'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/image'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/insertdatetime'
export default {
	name: 'TinyEditor',
	components: {
		editor
	},
	props: {
		value: {
			type: String,
			default: () => ''
		},
		disabled: {
			type: Boolean,
			default: () => false
		}
	},
	data() {
		let fonts = ['宋体=宋体', '微软雅黑=微软雅黑', '楷书=楷书', '隶书=隶书', '仿宋=仿宋', 'Verdana=Verdana']
		return {
			editorInit: {
				height: '365',
				language_url: '/static/tinymce/langs/zh_CN.js', //语言包的路径
				language: 'zh_CN', //语言
				skin_url: '/static/tinymce/skins/lightgray', //skin路径
				branding: false, //是否禁用“Powered by TinyMCE”
				menubar: true, //顶部菜单栏显示
				fontsize_formats: '10px 12px 14px 16px 18px 24px 36px',
				plugins: [
					'preview advlist autolink link lists hr table stylebuttons textcolor wordcount image wordcount insertdatetime'
				],
				fonts: ['宋体'],
				toolbar:
					'insertfile undo redo | fontselect fontsizeselect | style-p style-h2 style-h3 style-h4 | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link unlink image | preview media fullpage | forecolor backcolor | insertdatetime',
				font_formats: fonts.join(';'),
				paste_data_images: true,
				content_style: 'img {width:100%;}',

				images_upload_handler: (blobInfo, success, failure) => {
					let formData = new FormData(),
						token = this.$baseMethod.getStore('_ccmUser').token
					formData.append('file', blobInfo.blob())
					formData.append('op', 'uploadWsfFile')
					formData.append('token', token)
					formData.append('data', JSON.stringify({}))

					let url = '/common/file/select'
					this.$upLoad(url, formData)
						.then((res) => {
							// console.log(JSON.parse(res.data).file)
							success(JSON.parse(res.data).url) //提交图片返回url
						})
						.catch((err) => {
							this.$message.error(err.msg)
							failure(err.msg)
						})
					return false
				}
			},
			contentTxt: ''
		}
	},

	watch: {
		value: {
			immediate: true,
			handler(val) {
				this.contentTxt = val
			}
		}
	},

	created() {
		tinymce.PluginManager.add('stylebuttons', function (editor, url) {
			;['pre', 'p', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(function (name) {
				editor.addButton('style-' + name, {
					tooltip: 'Toggle ' + name,
					text: name.toUpperCase(),
					onClick: function () {
						editor.execCommand('mceToggleFormat', false, name)
					},
					onPostRender: function () {
						let self = this,
							setup = function () {
								editor.formatter.formatChanged(name, function (state) {
									self.active(state)
								})
							}
						editor.formatter ? setup() : editor.on('init', setup)
					}
				})
			})
		})
	},

	mounted() {
		tinymce.init({})
	},

	methods: {
		getContent() {
			let val = tinymce.activeEditor.getContent()
			val = val.replace(/[&nbsp;]|\s/g, '')
			if (val !== '<></>') {
				return tinymce.activeEditor.getContent()
			}
		}
	}
}
</script>
