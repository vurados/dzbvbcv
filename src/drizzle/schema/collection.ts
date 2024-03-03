import { int, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { user } from './user'
import { sql } from "drizzle-orm";


export const collection = sqliteTable("collection", {
    id: int("id").primaryKey({ autoIncrement: true }).unique().notNull(),
    userId: int("userId").references(() => user.id),
    title: text('title').notNull(),
    color: text('color'),
    createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`)
})