export const nameList = {
	all: '',
	yunzhong: 1
}

export const nameMap = {
	[nameList.all]: '全部',
	[nameList.yunzhong]: '芸众'
}
export const changeTypeList = {
	all: '',
	// chargeSuccess: 1,
	// chargeFailed: 2,
	// chargeGo: 3,
	inGo: 4,
	goTo: 5,
	chargeFailed: 2
}

export const changeTypeMap = {
	[changeTypeList.all]: '全部',
	// [changeTypeList.chargeSuccess]: '汇聚余额采购',
	// [changeTypeList.chargeFailed]: '站内余额采购',
	// [changeTypeList.chargeGo]: '汇聚余额充值',
	[changeTypeList.inGo]: '余额充值',
	[changeTypeList.goTo]: '余额退款',
	// [changeTypeList.back]: '余额扣除',
	[changeTypeList.chargeFailed]: '余额采购'
}
