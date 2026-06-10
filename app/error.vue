<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
	error: Object as () => NuxtError,
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
<!--	<LayoutHeader />-->
	<UError
		:error="error"
		:ui="{
			statusMessage: 'font-brand',
			statusCode: 'font-mono text-2xl text-dimmed',
		}"
	/>
</template>

<style scoped>

</style>
