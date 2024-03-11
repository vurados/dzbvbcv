import { int, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { collections } from "./collection";
import { sql, relations } from "drizzle-orm";


export type Note = {
    id: number;
    collectionId?: number;
    title?: string;
    content?: string;
    order?: number;
    width?: number;
    heght?: number;
    createdAt?: string;
}


export const notes = sqliteTable("note", {
    id: int("id").primaryKey({ autoIncrement: true }).unique().notNull(),
    collectionId: int("collectionId").references(() => collections.id, {onDelete: "cascade"}),
    title: text('title').notNull(),
    content: text('title').notNull(),
    order: int('oreder').notNull(),
    width: int('width').default(1),
    height: int('height').default(1),
    createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`)
})

export const collectionUserRelations = relations(notes, ({ one }) => ({
    collection: one(collections, {
      fields: [notes.collectionId],
      references: [collections.id],
    }),
}))