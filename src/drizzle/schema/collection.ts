import { int, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { users } from './user'
import { notes } from './note'
import { sql, relations } from "drizzle-orm";

export type Collection = {
    id: number;
    userId?: number;
    title?: string;
    color?: string;
    isEncrypted?: boolean;
    cryptHash?: string;
    createdAt?: string;
}

export const collections = sqliteTable("collection", {
    id: int("id").primaryKey({ autoIncrement: true }).unique().notNull(),
    userId: int("userId").references(() => users.id, {onDelete: "cascade"}),
    title: text('title').notNull(),
    color: text('color').default('#ffffff'),
    isEncrypted: int('isEncrypted', { mode: 'boolean'}).default(false),
    cryptHash: text('cryptHash'),
    createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`)
})

// ---------Relations--------------- //

//User <==> Collections
export const collectionUserRelations = relations(collections, ({ one }) => ({
    user: one(users, {
      fields: [collections.userId],
      references: [users.id],
    }),
}))


//Collection  <==> Note
export const collectionNoteRelation = relations(collections, ({many}) => ({
    notes: many(notes)
}))