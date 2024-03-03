import type { Config } from "drizzle-kit";
import 'dotenv/config'

const turso_url = process.env.TURSO_DATABASE_URL || ""
const auth_token = process.env.TURSO_AUTH_TOKEN || ""

if (turso_url ==  ""){
  throw new Error("TURSO_DATABASE_URL is not set")
}

if (auth_token ==  ""){
  throw new Error("TURSO_AUTH_TOKEN is not set")
}

export default {
  schema: "./src/drizzle/schema/*",
  out: "./src/drizzle/migrations",
  driver: "turso",
  dbCredentials: {
    url:  turso_url,
    authToken: auth_token,
  },
} satisfies Config;