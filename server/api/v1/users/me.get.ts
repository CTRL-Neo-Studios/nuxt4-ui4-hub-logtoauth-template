import {useServerAuth} from "#server/utils/core/useServerAuth";

export default defineEventHandler(async (event) => {
	const $auth = useServerAuth()

	return await $auth.requireUser(event)
})
