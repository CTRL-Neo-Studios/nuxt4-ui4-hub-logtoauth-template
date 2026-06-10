import { z } from 'zod';
import {useServerUsers} from "#server/utils/core/useServerUsers";

const routeParamsSchema = z.object({
	userId: z.coerce.string()
})

const bodySchema = z.object({
	banReason: z.string().optional(),
	banExpires: z.coerce.date().optional()
})

export default defineEventHandler(async event => {
	const { userId } = await getValidatedRouterParams(event, routeParamsSchema.parse)
	const { banReason, banExpires } = await readValidatedBody(event, bodySchema.parse)
	const { banUserHandler } = useServerUsers()

	return await banUserHandler(event, userId, banReason, banExpires)
})
