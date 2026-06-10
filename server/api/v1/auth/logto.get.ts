import { db, schema } from "@nuxthub/db";
import { eq, or } from 'drizzle-orm'

export default defineOAuthOidcEventHandler({
	config: {
		clientId: process.env.NUXT_OAUTH_LOGTO_CLIENT_ID,
		clientSecret: process.env.NUXT_OAUTH_LOGTO_CLIENT_SECRET,
		openidConfig: process.env.NUXT_OAUTH_LOGTO_DISCOVERY_URL,
		scope: ["openid", "profile", "email"],
		redirectURL: `${process.env.NUXT_PUBLIC_SITE_URL}/api/v1/auth/logto`,
	},

	async onSuccess(event, { user: logtoUser }) {
		const sub = logtoUser.sub;

		// return sendRedirect(event, "/dashboard");

		const existing = await db.query.user.findFirst({
			where: or(eq(schema.user.id, sub), eq(schema.user.email, `${logtoUser.email}`)),
		});

		if (!existing) {
			// First login — create local user row
			await db.insert(schema.user).values({
				id: sub,
				username: logtoUser.preferred_username ?? logtoUser.name ?? logtoUser.email ?? `User ${useServerUuid().slice(0, 4)}`,
				email: logtoUser.email ?? "",
				emailVerified: logtoUser.email_verified ?? false,
				avatarUrl: logtoUser.picture ?? null,
				role: "user",
				banned: false,
			});
		} else if (existing.id !== logtoUser.sub) {
			await db.update(schema.user).set({ id: logtoUser.sub }).where(or(eq(schema.user.id, sub), eq(schema.user.email, `${logtoUser.email}`)))
		}

		// Fetch minimal session payload — always use DB as source of truth for role/banned.
		// Re-fetch after an id update so the session reflects the new id, not the stale `existing`.
		const sessionUser = await db.query.user.findFirst({
			where: eq(schema.user.id, sub),
			columns: { id: true, role: true, emailVerified: true, banned: true },
		});

		if (!sessionUser) {
			throw createError({ statusCode: 500, statusMessage: "Failed to resolve user after login" });
		}

		if (sessionUser.banned) {
			throw createError({ statusCode: 403, statusMessage: "Your account has been banned." });
		}

		// Set the sealed session cookie (nuxt-auth-utils)
		await setUserSession(event, {
			user: {
				id: sessionUser.id,
				role: sessionUser.role,
				emailVerified: sessionUser.emailVerified,
			},
		});

		return sendRedirect(event, "/");
	},

	onError(event, error) {
		console.error("[Logto OAuth] error:", error);
		return sendRedirect(event, `/signin?error=${encodeURIComponent(error.message ?? "login_failed")}`);
	},
});
