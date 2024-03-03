import { int, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { collection } from "./collection";
import { sql } from "drizzle-orm";


export const note = sqliteTable("note", {
    id: int("id").primaryKey({ autoIncrement: true }).unique().notNull(),
    collectionId: int("collectionId").references(() => collection.id),
    title: text('title').notNull(),
    content: text('title').notNull(),
    order: int('oreder').notNull(),
    width: int('width'),
    height: int('height'),
    createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`)
})