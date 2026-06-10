import type {UserRole} from "#shared/types/db";

declare module "#auth-utils" {
	interface User {
		id: string;
		role: UserRole;
		emailVerified: boolean;
	}
}

export {};
