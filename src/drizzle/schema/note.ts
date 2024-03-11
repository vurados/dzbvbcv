import { int, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { collections } from "./collection";
import { sql, relations } from "drizzle-orm";


export const notes = sqliteTable("note", {
    id: int("id").primaryKey({ autoIncrement: true }).unique().notNull(),
    collectionId: int("collectionId").references(() => collections.id),
    title: text('title').notNull(),
    content: text('title').notNull(),
    order: int('oreder').notNull(),
    width: int('width'),
    height: int('height'),
    createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`)
})

export const collectionUserRelations = relations(notes, ({ one }) => ({
    collection: one(collections, {
      fields: [notes.collectionId],
      references: [collections.id],
    }),
}))