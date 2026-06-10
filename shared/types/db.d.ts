import type {
	BuildQueryResult,
	DBQueryConfig,
	ExtractTablesWithRelations,
	InferInsertModel,
	InferSelectModel
} from "drizzle-orm";
import { schema } from "@nuxthub/db"

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
	"one" | "many",
	boolean,
	TSchema,
	TSchema[TableName]
>["with"];

export type InferResultType<
	TableName extends keyof TSchema,
	With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
	TSchema,
	TSchema[TableName],
	{
		with: With;
	}
>;


export type User = InferSelectModel<typeof schema.user>;
export type UserInsert = InferInsertModel<typeof schema.user>;
export type DbFile = InferSelectModel<typeof schema.file>;
export type DbFileInsert = InferInsertModel<typeof schema.file>;

export type UserRole = User['role']
