import { db, schema } from "@nuxthub/db"
import {useServerAuth} from "#server/utils/core/useServerAuth";
import {H3Event} from "h3";
import {eq} from "drizzle-orm";
import {userAbilities} from "#shared/abilities/userAbilities";
import type { User, UserInsert } from "#shared/types/db"
import {satisfies} from "#shared/utils/roles";

export function useServerUsers() {
	const $auth = useServerAuth()

	async function getDbUserFromId(userId?: string): Promise<User | undefined> {
		if (!userId) return;
		return await db.query.user.findFirst({
			where: eq(schema.user.id, userId)
		})
	}

	async function getUsersHandler(event: H3Event): Promise<User[]> {
		await authorize(event, userAbilities().listUsers)

		return await db.query.user.findMany()
	}

	async function getUserHandler(event: H3Event, targetUserId: string): Promise<User | undefined> {
		await authorize(event, userAbilities().getUser)

		const targetUser = await getDbUserFromId(targetUserId)
		if (!targetUser) return undefined

		const requestingUser = await $auth.getUser(event)
		if (requestingUser && (satisfies(requestingUser, { minRole: 'admin' }) || requestingUser.id === targetUserId)) {
			return targetUser
		}

		const { email, banned, banReason, banExpires, emailVerified, ...publicFields } = targetUser
		return publicFields as User
	}

	async function editUserHandler(event: H3Event, targetUserId: string, values: UserInsert): Promise<User | undefined> {
		await authorize(event, userAbilities().editUser, await getDbUserFromId(targetUserId))

		const user = await $auth.requireUser(event)
		const { id, createdAt, updatedAt, role, banned, banReason, banExpires, emailVerified, ...safeValues } = values

		const [updatedUser] = await db.update(schema.user)
			.set({
				...safeValues,
				...(satisfies(user, { minRole: 'admin' }) ? {
					role,
					banned,
					banReason,
					banExpires
				} : {})
			})
			.where(eq(schema.user.id, targetUserId))
			.returning()

		return updatedUser
	}

	async function deleteUserHandler(event: H3Event, targetUserId: string): Promise<User | undefined> {
		await authorize(event, userAbilities().deleteUser, await getDbUserFromId(targetUserId))

		const [deletedUser] = await db.delete(schema.user)
			.where(eq(schema.user.id, targetUserId))
			.returning()

		return deletedUser
	}

	async function promoteUserHandler(event: H3Event, targetUserId: string): Promise<User | undefined> {
		await authorize(event, userAbilities().promoteUser, await getDbUserFromId(targetUserId))

		const [user] = await db.update(schema.user)
			.set({
				role: 'moderator'
			})
			.where(eq(schema.user.id, targetUserId))
			.returning()

		return user
	}

	async function demoteUserHandler(event: H3Event, targetUserId: string): Promise<User | undefined> {
		await authorize(event, userAbilities().demoteUser, await getDbUserFromId(targetUserId))

		const [user] = await db.update(schema.user)
			.set({
				role: 'user'
			})
			.where(eq(schema.user.id, targetUserId))
			.returning()

		return user
	}

	async function banUserHandler(event: H3Event, targetUserId: string, banReason?: string, banExpires?: Date): Promise<User | undefined> {
		await authorize(event, userAbilities().banUser, await getDbUserFromId(targetUserId))

		const [user] = await db.update(schema.user)
			.set({
				banned: true,
				banReason,
				banExpires
			})
			.where(eq(schema.user.id, targetUserId))
			.returning()

		return user
	}

	async function unbanUserHandler(event: H3Event, targetUserId: string): Promise<User | undefined> {
		await authorize(event, userAbilities().unbanUser, await getDbUserFromId(targetUserId))


		const [user] = await db.update(schema.user)
			.set({
				banned: false,
				banReason: null,
				banExpires: null
			})
			.where(eq(schema.user.id, targetUserId))
			.returning()

		return user
	}

	return {
		getDbUserFromId,
		getUsersHandler,
		getUserHandler,
		editUserHandler,
		deleteUserHandler,
		promoteUserHandler,
		demoteUserHandler,
		banUserHandler,
		unbanUserHandler
	}
}
