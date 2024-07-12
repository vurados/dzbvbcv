import { drizzle } from "drizzle-orm/libsql"
import * as users from "./drizzle/schema/user"
import * as collections from "./drizzle/schema/collection"
import * as notes from "./drizzle/schema/note"
import { createClient } from "@libsql/client"
import { migrate } from "drizzle-orm/libsql/migrator";


const turso = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN
})

const db = drizzle(turso, {schema: {...users, ...collections, ...notes}})

const migrateDB = async () => {
    console.log('migrating database ...')
    await migrate(db, { migrationsFolder: 'src/drizzle/migrations' });
}

void migrateDB()