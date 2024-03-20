// ////const {User} = require('../models')
// import { Strategy } from 'passport-jwt'
// const ExtractJwt = require('passport-jwt').ExtractJwt
import fs from 'fs'
import path from 'path'
import { PassportStatic } from 'passport'
import { getUserById } from '../drizzle/actions/user'
// const JwtStrategy = require('passport-jwt').Strategy
// const ExtractJwt = require('passport-jwt').ExtractJwt

const Strategy = require('passport-jwt').Strategy

const pathToKey = path.join(__dirname, '..', 'Authentification/id_rsa_pub.pem') //im hardcoded this because it gives Serever/id_rsa_pub path TODO
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8')

const cookieExtractor = function(req: any) {
    // console.log('req.cookie from cookie extractor:  ',req.cookies);
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'].token;
        // console.log('token from cookieextractor:  ', token);
    }
    return token;
};

const options = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: PUB_KEY,
    algorithms: ['RS256'],
    passReqToCallback: true
}

export default (passport: PassportStatic) => {
    passport.use(new Strategy(options, (req: any, payload: any, done: any) => {
        console.info("🚀 ~ file: pasport_jwt.js:31 ~ strategy ~ payload:", JSON.stringify(payload))
        getUserById(payload.sub).then((user) => {
            if(user){
                req.user = user
                return done(null, user)
            }else{
                return done(null, false)
            }
        }).catch((err) => {
            console.error(err);
            done(err, null)})
    }))
}