const passport = require('passport');
const {ExtractJwt} = require('passport-jwt');
const {Strategy} = require('passport-jwt');
const User = require('../models/user.schema');

function initPassport(){
    passport.use(new Strategy({
        jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey:process.env.SECRET_KEY
    },
    (payload,done) => {
        User.findById(payload.id,(err,user)=>{
            if(err) return done(err,false);
            if(user) return done(null,user);
            return done(null,false);
        }
    )}
    )
  )
}

module.exports = initPassport;