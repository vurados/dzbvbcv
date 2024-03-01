import express from 'express'
import cookieParser from 'cookie-parser'
// import passport from 'passport'
import helmet from 'helmet'
import compression from 'compression'


const createServer = () => {
    const app = express()

    app.use(helmet())
    app.use(compression())
    app.use(cookieParser())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.get('/healthz', (req, res) => {
        res.status(200).send('Server us UP')
    })

    return app
}

export {createServer}