import { genPassword, issueJWT, verifyPassword } from '../Authentification/passwordUtils'
import passport from 'passport' 
import express from 'express' 
import {user} from "../drizzle/schema/schema"


const router = express.Router()
// 

router.get('/getUserFromJwt', passport.authenticate('jwt', {session: false}), async (req, res) => {
    const user = {id: req.user.id, username: req.user.username, email: req.user.email}
    res.status(200).json({success: true, user: user, msg: 'passport authentification went well, nicuuuuuuuuuuuu'})
})

router.post('/login', async(req, res) => {
    const {username, password} = req.body
    
    await User.findOne({where:{username: username}}).then((user) => {
        if (!user){
            res.status(401).json({success: false, msg: 'user with this username not found'})
        }
        
        const isValid = verifyPassword(password, user.password, user.salt)
        if (isValid){
            const jwt = issueJWT(user)
            res.cookie('jwt', jwt, {maxAge:86400000, httpOnly: true})
            res.cookie('jwtExist', true, {maxAge:86400000})
            res.status(200).json({success: true, msg:'User successfully logged in', user: user})
        } else {
            res.status(401).json({success: false, msg:'password is incorrect'})
        }
    }).catch((err) => res.json({msg:err}))
})

router.post('/createUser', async(req, res) => {
    const user = req.body
    console.info('user=======>',user);
    const {salt, hash} = genPassword(user.password)
    user.password = hash
    user.salt = salt

    // await User.findOne({where: {username: user.username}})
    //     .then((user) => {
    //         if(user){res.status(202).json({success: false, msg: 'User already exist'})}})
    //     .catch((err) => res.send(err))
    console.info('user=======>',user);
    await User.create(user)
        .then((newUser) => {
            const jwt = issueJWT(newUser)
            res.cookie('jwt', jwt, {maxAge:86400000, httpOnly: true})
            res.cookie('jwtExist', true, {maxAge:86400000})
            res.status(200).json({success: true, msg:'User successfully signed up', user: newUser})})
        .catch((error) => {res.status(401).json({success: false, msg: 'Error creating user entity', error: error.message})})
    // res.send('The error ocurred during creating(posting) user entity into the table')
});

router.get('/logout', async(req, res) => {
    res.cookie('jwt', false, {maxAge:0, httpOnly: true})
    res.cookie('jwtExist', false, {maxAge:0})
    res.status(200).send('User successfuly logged out')
})

module.exports = router;