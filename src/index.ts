import {createServer} from './config/express.js'
import path from 'path'

const host = process.env.HOST || 'localhost'
const port = process.env.DB_PORT || 3001

const startServer = async () => {
    const app = await createServer()



    app.listen(port, () => console.info(`server running on port ${port}`))
}