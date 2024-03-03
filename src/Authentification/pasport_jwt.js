const {User} = require('../models')
const Strategy = require('passport-jwt').Strategy
// const ExtractJwt = require('passport-jwt').ExtractJwt
const fs = require('fs')
const path = require('path')
// const JwtStrategy = require('passport-jwt').Strategy
// const ExtractJwt = require('passport-jwt').ExtractJwt

const pathToKey = path.join(__dirname, '..', 'Authentification/id_rsa_pub.pem') //im hardcoded this because it gives Serever/id_rsa_pub path TODO
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8')

const cookieExtractor = function(req) {
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

const strategy = new Strategy(options, (req, payload, done) => {
    console.info("🚀 ~ file: pasport_jwt.js:31 ~ strategy ~ payload:", JSON.stringify(payload))
    User.findByPk(payload.sub).then((user) => {
        if(user){
            req.user = user
            return done(null, user)
        }else{
            return done(null, false)
        }
    }).catch((err) => {
        console.error(err);
        done(err, null)})
})


module.exports=(passport) => {passport.use(strategy)}