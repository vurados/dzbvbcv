import 'dotenv/config'
import {createServer} from './config/express.js'

import {db, turso, migrateDB } from './connect_db'


const host = process.env.HOST || 'localhost'
const port = process.env.DB_PORT || 3001  //TODO: why it DB? Port? change to "PORT"

const startServer = async () => {
    const app = await createServer()


    // app.use(express.static(path.join(__dirname, '../public')))


    app.listen(port, () => console.info(`server running on port ${port}`))
}

// migrateDB()
startServer()
