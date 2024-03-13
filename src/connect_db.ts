import { drizzle } from "drizzle-orm/libsql"
import * as users from "./drizzle/schema/user"
import * as collections from "./drizzle/schema/collection"
import * as notes from "./drizzle/schema/note"
import { createClient } from "@libsql/client"
import { migrate } from "drizzle-orm/libsql/migrator";


export const turso = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
})

export const db = drizzle(turso, {schema: {...users, ...collections, ...notes}});

export const migrateDB = async () => {
    console.log('migrating databse ...')
    await migrate(db, { migrationsFolder: 'src/drizzle/migrations' });
}