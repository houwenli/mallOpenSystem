export default async function (param, moduleName, postUrl) {
	try {
		const op = param.op
		const url = postUrl ? postUrl : window.$vuex.$getModuleUrl(moduleName, op)
		delete param.op

		const resData = await window.$vuex.$axios(url, { data: JSON.stringify(param), op })
		return { ...resData, data: resData.data && JSON.parse(resData.data) }
	} catch (err) {
		console.error(`[路由地址]：${window.location.pathname} ; [op]: ${param.op} ;[moduleName]: ${moduleName}`)
		return Promise.reject(err)
	}
}
