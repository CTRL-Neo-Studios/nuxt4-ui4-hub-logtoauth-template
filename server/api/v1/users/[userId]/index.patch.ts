import { z } from 'zod';
import {useServerUsers} from "#server/utils/core/useServerUsers";
import {UserInsert} from "#shared/types/db";

const routeParamsSchema = z.object({
	userId: z.coerce.string()
})

const bodySchema = z.custom<UserInsert>()

export default defineEventHandler(async event => {
	const { userId } = await getValidatedRouterParams(event, routeParamsSchema.parse)
	const body = await readValidatedBody(event, bodySchema.parse)
	const { editUserHandler } = useServerUsers()

	return await editUserHandler(event, userId, body)
})
