import { genPassword, issueJWT, verifyPassword } from '../Authentification/passwordUtils'
import passport from 'passport' 
import express from 'express' 
import { User } from '../drizzle/schema/user'
import { createUser, deleteUser, getUserByUsername } from '../drizzle/actions/user'
import '../Authentification/pasport_jwt'


const router = express.Router()
// 

router.get('/getUserFromJwt', passport.authenticate('jwt', {session: false}), async (req, res) => {
    const user = {id: req.user.id, username: req.user.username, email: req.user.email}
    res.status(200).json({success: true, user: user, msg: 'passport authentification went well, nicuuuuuuuuuuuu'})
})

router.post('/login', async(req, res) => {
    const {username, password} = req.body
    
    await getUserByUsername(username).then((user: User) => {
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

    console.info('user=======>',user);
    await createUser(user)
        .then((userId: bigint) => {
            const jwt = issueJWT(userId)
            res.cookie('jwt', jwt, {maxAge:86400000, httpOnly: true})
            res.cookie('jwtExist', true, {maxAge:86400000})
            res.status(200).json({success: true, msg:'User successfully signed up', user: user})})
        .catch((error) => {res.status(401).json({success: false, msg: 'Error creating user entity', error: error.message})})
    // res.send('The error ocurred during creating(posting) user entity into the table')
});

router.post('/deleteUser', passport.authenticate('jwt', {session: false}), async (req, res) => {
    const userId = req.user?.id
    await deleteUser(userId)
    res.status(200).json({success: true, msg: 'User successfully deleted'})
})

router.get('/logout', async(req, res) => {
    res.cookie('jwt', false, {maxAge:0, httpOnly: true})
    res.cookie('jwtExist', false, {maxAge:0})
    res.status(200).send('User successfuly logged out')
})

export default router;