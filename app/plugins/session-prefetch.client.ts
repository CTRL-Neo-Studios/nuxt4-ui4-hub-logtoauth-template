import { useAuthSession } from "~/composables/core/useAuthSession";

export default defineNuxtPlugin(async (nuxtApp) => {
	const $as = useAuthSession();

	if (!nuxtApp.payload.serverRendered) {
		await $as.refresh();
	} else if (
		Boolean(nuxtApp.payload.prerenderedAt) ||
		Boolean(nuxtApp.payload.isCached)
	) {
		nuxtApp.hook("app:suspense:resolve", async () => {
			await $as.refresh();
		});
	}
});
