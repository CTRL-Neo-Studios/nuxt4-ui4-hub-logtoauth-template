import { useAuthSession } from "~/composables/core/useAuthSession";

export default defineNuxtPlugin({
	name: "authorization-resolver",
	parallel: true,
	setup() {
		return {
			provide: {
				authorization: {
					resolveClientUser: () => unref(useAuthSession().user),
				},
			},
		};
	},
});
