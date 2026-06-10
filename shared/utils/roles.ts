import type {User, UserRole} from "#shared/types/db";

export const { getRoleLevel, hasMinRole, hasRole, satisfies, isAuthenticated } = createRoleChecker<User, UserRole>({
	hierarchy: ['user', 'moderator', 'admin'] as const,
	getRole: (user) => user.role,
	getBanned: (user) => user.banned || false,
	getVerified: (user) => !!user.email && !!user.emailVerified,
	getAuthIndicator: (user) => !!user.id
})
