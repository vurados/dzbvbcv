import express from 'express' 

const router = express.Router()

const API_VER = process.env.API_VERSION || 'ERROR'

router.get('/version', async (req, res) => {
    res.status(200).json({server: "up", msg: API_VER})
})