import { useAuthSession } from "~/composables/core/useAuthSession";

export default defineNuxtRouteMiddleware((to, from) => {
	const { loggedIn, user } = useAuthSession();
	if (!unref(loggedIn) || !unref(user)) {
		return navigateTo("/signin");
	}
});
