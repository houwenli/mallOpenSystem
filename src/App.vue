<template>
	<div id="app">
		<router-view />
	</div>
</template>

<style lang="less">
:root {
	// 用于根据左侧菜单的伸缩来控制右侧菜单的位置
	--leftWidth: 144px;
}
#app {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #303133;
	font-size: 14px;
	position: relative;
	height: 100%;
}

html,
body {
	height: 100%;
	background: #f5f7fa;
}
</style>
