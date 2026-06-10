import { z } from 'zod';
import {useServerUsers} from "#server/utils/core/useServerUsers";

const routeParamsSchema = z.object({
	userId: z.coerce.string()
})

export default defineEventHandler(async event => {
	const { userId } = await getValidatedRouterParams(event, routeParamsSchema.parse)
	const { demoteUserHandler } = useServerUsers()

	return await demoteUserHandler(event, userId)
})
