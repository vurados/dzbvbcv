import { int, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { collections } from "./collection";
import { sql, relations } from "drizzle-orm";
import { users } from "./user";


export type Note = {
    id: number;
    userId: number;
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
    userId: int("userId").references(() => users.id, {onDelete: "cascade"}),
    collectionId: int("collectionId").references(() => collections.id, {onDelete: "cascade"}),
    title: text('title').notNull(),
    content: text('title').notNull(),
    order: int('order').notNull().default(1),
    width: int('width').notNull().default(1),
    height: int('height').notNull().default(1),
    createdAt: int('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})

export const collectionUserRelations = relations(notes, ({ one }) => ({
    collection: one(collections, {
      fields: [notes.collectionId],
      references: [collections.id],
    }),
}))