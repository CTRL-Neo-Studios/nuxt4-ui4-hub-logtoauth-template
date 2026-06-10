<script setup lang="ts">
useHead({ title: "Sign In/Sign Up" });

definePageMeta({
	middleware: ["signin-if-session-invalid"],
});
</script>

<template>
</template>

<style scoped>
@reference "~/assets/css/main.css";
</style>
