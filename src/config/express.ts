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

    // const apiRouter = require('./routes/Api')
    // app.use('/api', apiRouter);

    // const userRouter = require('./routes/Users');
    // apiRouter.use('/users', userRouter);

    // const layoutRouter = require('./routes/Layouts');
    // apiRouter.use('/layouts', layoutRouter);

    // const noteRouter = require('./routes/Notes');
    // apiRouter.use('/notes', noteRouter);

    return app
}

export {createServer}