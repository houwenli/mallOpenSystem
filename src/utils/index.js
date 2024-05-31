import { Message } from 'element-ui'

/**
 * 验证图片尺寸
 * @param {File|String} file
 * @param {Number} w 期望的宽度
 * @param {Number} h 期望的高度
 * @returns Boolean
 */
export const validImageSize = async (file, w, h) => {
	let url = null
	if (file instanceof File) {
		url = window.URL.createObjectURL(file)
	}

	let { width, height } = await getImageSize(url)

	if (width === parseInt(w) && height === parseInt(h)) return true

	Message.error(`请上传尺寸为${w}px*${h}px的图片！`)
	return false
}

/**
 * 获取图片的宽高
 * */
export const getImageSize = (url) => {
	let img = new Image()

	img.src = url

	return new Promise((resolve) => {
		img.onload = () => {
			let { width, height } = img
			resolve({
				width,
				height
			})
		}
	})
}
export function debounce(func, wait = 1000) {
	//可以放入项目中的公共方法中进行调用（鹅只是省事）
	let timeout
	return function (event) {
		clearTimeout(timeout)
		timeout = setTimeout(() => {
			func.call(this, event)
		}, wait)
	}
}
// 数值、小数点多少位
export const checkNum = function (value, num) {
	// 小数点多少位
	let map = {
		1: /^(\-)*(\d+)\.(\d).*$/, //1位小数
		2: /^(\-)*(\d*)\.(\d\d).*$/ //2位小数
	}
	value = value.replace(/^0*(0\.|[1-9])/, '$1')
	value = value.replace(/[^\d.]/g, '') //清除"数字"和"."以外的字符
	value = value.replace(/^\./g, '') //验证第一个字符是数字而不是字符
	value = value.replace(/\.{1,}/g, '.') //只保留第一个.清除多余的
	value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
	value = value.replace(map[num], '$1$2.$3') //只能输入几个小数
	return value
}

// 深拷贝对象
export function deepClone(obj) {
	const _toString = Object.prototype.toString

	// null, undefined, non-object, function
	if (!obj || typeof obj !== 'object') {
		return obj
	}

	// DOM Node
	if (obj.nodeType && 'cloneNode' in obj) {
		return obj.cloneNode(true)
	}

	// Date
	if (_toString.call(obj) === '[object Date]') {
		return new Date(obj.getTime())
	}

	// RegExp
	if (_toString.call(obj) === '[object RegExp]') {
		const flags = []
		if (obj.global) {
			flags.push('g')
		}
		if (obj.multiline) {
			flags.push('m')
		}
		if (obj.ignoreCase) {
			flags.push('i')
		}

		return new RegExp(obj.source, flags.join(''))
	}

	const result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {}

	for (const key in obj) {
		result[key] = deepClone(obj[key])
	}

	return result
}

// 树形结构计算层级
export function calcTreeLevel(tree, init) {
	tree.level = init
	if (tree.children && tree.children.length > 0) {
		tree.children.forEach((item) => {
			calcTreeLevel(item, tree.level + 1)
		})
	}
}
