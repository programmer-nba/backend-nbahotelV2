const passport = require('passport');
const {ExtractJwt} = require('passport-jwt');
const {Strategy} = require('passport-jwt');
const Member = require('../models/member.schema');

function initPassport(){
    passport.use(new Strategy({
        jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey:process.env.SECRET_KEY
    },
    (payload,done) => {
        Member.findById(payload.id,(err,Member)=>{
            if(err) return done(err,false);
            if(Member) return done(null,Member);
            return done(null,false);
        }
    )}
    )
  )
}

module.exports = initPassport;