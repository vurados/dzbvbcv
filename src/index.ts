import 'dotenv/config'
import {createServer} from './config/express.js'

import {db, turso } from './connect_db.js'
import { user } from './drizzle/schema/user.js'
import { migrate } from 'drizzle-orm/libsql/migrator'


const host = process.env.HOST || 'localhost'
const port = process.env.DB_PORT || 3001

const startServer = async () => {
    const app = await createServer()


    // app.use(express.static(path.join(__dirname, '../public')))


    app.listen(port, () => console.info(`server running on port ${port}`))
}

startServer()