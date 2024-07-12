import { sql, relations } from "drizzle-orm";
import { int, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { collections } from "./collection";


export type User = {
    id: number;
    username?: string;
    email?: string;
    password?: string;
    salt?: string;
    createdAt?: string | null;
}

export const users = sqliteTable("user", {
    id: int("id").primaryKey({ autoIncrement: true }).unique().notNull(),
    username: text('username').unique().notNull(),
    email: text('email').unique().notNull(),
    password: text('password').notNull(),
    salt: text('salt').notNull(),
    createdAt: int('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})

export const userCollectionRelation = relations(users, ({many}) => ({
    collection: many(collections)
}))