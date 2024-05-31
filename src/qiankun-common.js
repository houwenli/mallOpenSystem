function registerGlobalModule(store, props = {}) {
	if (!store || !store.hasModule) return

	// 初始化数据
	const initState = { ...props.globalState }

	if (!store.hasModule('global')) {
		const globalModule = {
			namespaced: true,
			state: initState,
			actions: {
				// 子应用改变state并通知父应用
				setGlobalState({ commit }, payload) {
					commit('setGlobalState', payload)
					commit('emitGlobalState', payload)
				},
				// 初始化，只用于mount时同步父应用的数据
				initGlobalState({ commit }, payload) {
					commit('setGlobalState', payload)
				}
			},
			mutations: {
				setGlobalState(state, payload) {
					state = Object.assign(state, payload)
				},
				emitGlobalState(state) {
					if (props.setGlobalState) {
						props.setGlobalState(state)
					}
				}
			}
		}
		store.registerModule('global', globalModule)
	} else {
		store.commit('global/setGlobalState', initState)
	}
}

function initGlobalState(store, props) {
	registerGlobalModule(store, props)
}

export default {
	initGlobalState
}
