import express from 'express'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import helmet from 'helmet'
import compression from 'compression'

import apiRouter from '../routes/Api'
import userRouter from '../routes/Users'
import collectionRouter from '../routes/Collecitons'
import noteRouter from '../routes/Notes'

import jwtPassport from '../Authentification/pasport_jwt'

const createServer = () => {
    const app = express()

    jwtPassport(passport)
    app.use(passport.initialize())

    app.use(helmet())
    app.use(compression())
    app.use(cookieParser())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.get('/healthz', (req, res) => {
        res.status(200).send('Server us UP')
    })

    app.use('/api', apiRouter);

    apiRouter.use('/users', userRouter);

    apiRouter.use('/collections', collectionRouter);

    apiRouter.use('/notes', noteRouter);

    return app
}

export {createServer}