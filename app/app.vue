<script setup lang="ts">
useHead({
	meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
	link: [{ rel: "icon", href: "/favicon.ico" }],
	htmlAttrs: {
		lang: "en",
	},
});

const $rc = useRuntimeConfig()

const title = $rc.public.siteName as string || 'My Site';
const description = "My awesome website.";

useSeoMeta({
	title,
	description,
	ogTitle: title,
	ogDescription: description,
	ogImage: "https://ui.nuxt.com/assets/templates/nuxt/starter-light.png",
	twitterCard: "summary_large_image",
});

useHead({
	titleTemplate: (titleChunk) => {
		return !titleChunk?.includes(unref(title))
			? `${titleChunk} - ${unref(title)}`
			: unref(title);
	},
});
</script>

<template>
	<UApp>
		<NuxtLoadingIndicator color="var(--ui-primary)" />

		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</UApp>
</template>
