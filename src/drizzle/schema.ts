import { sql } from "drizzle-orm";
import { int, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
    id: int("id").primaryKey({ autoIncrement: true }).unique().notNull(),
    username: text('username').notNull(),
    email: text('email').unique().notNull(),
    password: text('email').notNull(),
    salt: text('email').notNull(),
})