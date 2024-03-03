import { sql } from "drizzle-orm";
import { int, text, sqliteTable } from "drizzle-orm/sqlite-core";


export const user = sqliteTable("user", {
    id: int("id").primaryKey({ autoIncrement: true }).unique().notNull(),
    username: text('username').notNull(),
    email: text('email').unique().notNull(),
    password: text('password').notNull(),
    salt: text('salt').notNull(),
    createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`)
})