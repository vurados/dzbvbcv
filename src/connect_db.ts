import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"
import { migrate } from "drizzle-orm/libsql/migrator";


export const turso = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
})

export const db = drizzle(turso);

export const migrateDB = async () => {
    console.log('migrating databse ...')
    await migrate(db, { migrationsFolder: 'src/drizzle/migrations' });
}