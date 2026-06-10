import type { User } from "#shared/types/db";

/**
 * App-level auth session composable.
 *
 * Wraps nuxt-auth-utils `useUserSession()` and exposes the same interface
 * that all middleware, plugins, and components expect.
 *
 * Session payload stored in the sealed cookie: { id, role, emailVerified }
 * Full User record is available by fetching from the DB via API routes.
 */
export function useAuthSession() {
	const { user: sessionUser, session, fetch, clear, loggedIn, ready } = useUserSession();

	// Cast the nuxt-auth-utils User (augmented in app/types/auth.d.ts) to the full DB User type.
	// The cookie only stores id/role/emailVerified; other fields will be undefined on the client.
	const userState = useState<User | null | undefined>('auth.user', () => null)
	const requestFetch = useRequestFetch()
	const requestHeaders = import.meta.server ? useRequestHeaders() : undefined;

	async function refresh() {
		await fetch();
		userState.value = await requestFetch<User | undefined>('/api/v1/users/me', {
			method: 'get',
			headers: requestHeaders,
			retry: false,
		}).catch(() => null)
		if (import.meta.dev)
			console.debug('watch user', unref(userState))
	}

	async function signOut(reloadWindow: boolean = true) {
		await requestFetch("/api/v1/auth/logout", {
			method: 'post',
			headers: requestHeaders,
		});
		userState.value = null
		await clear();

		if (reloadWindow)
			window.location.reload()
	}

	return {
		session: computed(() => unref(session)),
		user: computed(() => unref(userState)),
		loggedIn: computed(() => unref(loggedIn)),
		ready: computed(() => unref(ready)),
		// Keep `fetch` and `clear` as aliases for compatibility with any direct callers
		fetch,
		clear: signOut,
		refresh,
	};
}
