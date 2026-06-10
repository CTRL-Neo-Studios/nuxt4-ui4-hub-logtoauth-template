import {useServerUsers} from "#server/utils/core/useServerUsers";

export default defineEventHandler(async event => {
	const { getUsersHandler } = useServerUsers()

	return await getUsersHandler(event)
})
