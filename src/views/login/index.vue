<template>
	<ws-login></ws-login>
</template>

<script>
export default {
	name: 'login',
	created() {
		this.$baseMethod.setStore('navTabList', [])
		this.$watermark.remove()
	}
}
</script>
