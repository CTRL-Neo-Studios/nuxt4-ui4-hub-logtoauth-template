import { useAuthSession } from "~/composables/core/useAuthSession";
import type {User, UserInsert} from "#shared/types/db";

export function useMe() {
	const $session = useAuthSession();

	const userId = computed(() => unref($session.user)?.id);

	/** Fetches the full profile for the current user, including role-based relations. */
	async function getMe() {
		const id = unref(userId);
		if (!id) return undefined;

		return $fetch<User>(`/api/v1/users/${id}`, {
			method: "get",
			headers: useRequestHeaders(),
		});
	}

	/** Patches the current user's editable profile fields. */
	async function updateMe(values: Partial<UserInsert>): Promise<User> {
		const id = unref(userId);
		if (!id) throw new Error("Not authenticated");

		return $fetch<User>(`/api/v1/users/${id}`, {
			method: "patch",
			headers: useRequestHeaders(),
			body: values,
		});
	}

	return {
		// Session state pass-throughs
		user: $session.user,
		loggedIn: $session.loggedIn,
		pending: $session.ready,
		signOut: $session.clear,
		refresh: $session.refresh,
		// Profile API
		getMe,
		updateMe,
	};
}
