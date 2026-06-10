import { type EventHandlerRequest, H3Event } from "h3";
import { db as $db, schema } from '@nuxthub/db'
import { eq } from 'drizzle-orm'
import { RoleCheckOptions } from "@type32/nuxt-cs-utils";
import type { UserRole, User } from "#shared/types/db";
import {satisfies} from "#shared/utils/roles";

export function useServerAuth() {

	async function getDbUserFromSession(event: H3Event<EventHandlerRequest>): Promise<User | undefined> {
		const sesh = await getUserSession(event)
		if (!sesh.user) return;

		return await $db.query.user.findFirst({
			where: eq(schema.user.id, sesh.user.id)
		})
	}

	/**
	 * Returns the raw nuxt-auth-utils session (sealed cookie contents), or null.
	 */
	async function getRawSession(event: H3Event<EventHandlerRequest>) {
		return await getUserSession(event);
	}

	/**
	 * Returns the minimal session user (`{ id, role, emailVerified }`) cast to User, or undefined.
	 * Does NOT throw — callers that need a guaranteed user should use `requireUser`.
	 */
	async function getUser(event: H3Event<EventHandlerRequest>): Promise<User | undefined> {
		const session = await getRawSession(event);
		return await getDbUserFromSession(event);
	}

	async function isSessionAuthenticated(event: H3Event<EventHandlerRequest>): Promise<boolean> {
		return !!(await getUser(event));
	}

	async function requireSession(
		event: H3Event<EventHandlerRequest>,
		opts?: RoleCheckOptions<UserRole>,
	) {
		const user = await getDbUserFromSession(event);

		if (!user || (opts && !satisfies(user, opts))) {
			throw createError({
				statusCode: 403,
				statusMessage: opts?.verified && !user?.email ? "Email not verified" : "Unauthorized",
			});
		}

		return { user };
	}

	async function requireUser(
		event: H3Event<EventHandlerRequest>,
		opts?: RoleCheckOptions<UserRole>,
	): Promise<User> {
		return (await requireSession(event, opts)).user;
	}

	async function isSession(
		event: H3Event<EventHandlerRequest>,
		opts?: RoleCheckOptions<UserRole>,
	): Promise<boolean> {
		const user = await getUser(event);
		if (!user) return false;
		return opts ? satisfies(user, opts) : true;
	}

	return {
		getUserSession: getRawSession,
		getUser,
		isSessionAuthenticated,
		requireSession,
		requireUser,
		isSession,
	};
}
