import type {UserRole} from "#shared/types/db"

export interface GetUsersOptions {
	name?: string;
	role?: UserRole;
	email?: string;
	banned?: boolean;
}
