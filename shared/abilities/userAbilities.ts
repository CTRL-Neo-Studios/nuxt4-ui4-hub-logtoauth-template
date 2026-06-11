import type {User, UserInsert} from "#shared/types/db";
import {satisfies} from "#shared/utils/roles";

export function userAbilities() {
	return {
		listUsers: defineAbility((user: User) => {
			return satisfies(user, { minRole: 'admin' })
		}),

		getUser: defineAbility((user: User) => {
			return satisfies(user)
		}),

		editUser: defineAbility((user: User, targetUser?: User) => {
			if (!targetUser) return false;
			return satisfies(user, { minRole: 'admin' }) || user.id === targetUser.id
		}),

		deleteUser: defineAbility((user: User, targetUser?: User) => {
			if (!targetUser) return false;
			return satisfies(user, { minRole: 'admin' }) && user.id !== targetUser.id
		}),

		promoteUser: defineAbility((user: User, targetUser?: User) => {
			if (!targetUser) return false;
			return satisfies(user, { minRole: 'moderator' }) && targetUser.role === 'user'
		}),

		demoteUser: defineAbility((user: User, targetUser?: User) => {
			if (!targetUser) return false;
			return satisfies(user, { minRole: 'moderator' }) && satisfies(targetUser, { minRole: 'moderator' })
		}),

		banUser: defineAbility((user: User, targetUser?: User) => {
			if (!targetUser) return false;
			return satisfies(user, { minRole: 'moderator' })
		}),

		unbanUser: defineAbility((user: User, targetUser?: User) => {
			if (!targetUser) return false;
			return satisfies(user, { minRole: 'moderator' })
		})
	}
}
