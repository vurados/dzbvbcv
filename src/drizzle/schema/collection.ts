import { int, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { users } from './user'
import { notes } from './note'
import { sql, relations } from "drizzle-orm";


export const collections = sqliteTable("collection", {
    id: int("id").primaryKey({ autoIncrement: true }).unique().notNull(),
    userId: int("userId").references(() => users.id),
    title: text('title').notNull(),
    color: text('color'),
    createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`)
})

export const collectionUserRelations = relations(collections, ({ one }) => ({
    user: one(users, {
      fields: [collections.userId],
      references: [users.id],
    }),
}))

export const collectionNoteRelation = relations(collections, ({many}) => ({
    notes: many(notes)
}))