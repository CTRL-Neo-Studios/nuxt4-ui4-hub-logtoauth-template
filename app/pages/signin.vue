<script setup lang="ts">
useHead({ title: "Sign In/Sign Up" });

definePageMeta({
	middleware: ["home-if-session-valid"],
});
</script>

<template>
	<UMain class="flex flex-col items-center justify-center gap-4 p-4">
		<UPageCard class="w-full max-w-md">
			<UAuthForm
				title="Sign In/Sign Up"
				description="Sign in/Sign up to an account to continue."
				icon="i-lucide-log-in"
				:providers="[
					{
						label: 'Sign in/Sign up with Neo ID',
						avatar: {
							src: 'https://ctrl-neo.dev/ctrl-neo-light.svg',
							icon: 'i-lucide-log-in',
						},
						to: '/api/v1/auth/logto',
						external: true,
					},
				]"
			/>
		</UPageCard>
	</UMain>
</template>
