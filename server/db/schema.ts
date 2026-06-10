import {bigserial, boolean, pgTable, primaryKey, text, timestamp, uuid, varchar} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

const createdUpdatedAtColumns = {
	createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
}

// Tables

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	username: text().notNull(),
	email: text().notNull().unique(),
	emailVerified: boolean().default(false).notNull(),
	avatarUrl: text(),
	role: text({ enum: ["user", "moderator", "admin"] })
		.default("user")
		.$defaultFn(() => "user")
		.notNull(),
	banned: boolean().notNull().default(false).$defaultFn(() => false),
	banReason: text(),
	banExpires: timestamp(),

	...createdUpdatedAtColumns
});

export const file = pgTable("file", {
	id: uuid().primaryKey().defaultRandom(),
	ownerId: text().references(() => user.id, { onDelete: "set null", onUpdate: "cascade" }),
	blobPath: text().notNull(),
	fileName: text(),

	...createdUpdatedAtColumns
});

// Relations

export const userRelations = relations(user, ({ many }) => ({
	files: many(file),
}))

export const fileRelations = relations(file, ({ one }) => ({
	owner: one(user, {
		fields: [file.ownerId],
		references: [user.id],
	})
}))
