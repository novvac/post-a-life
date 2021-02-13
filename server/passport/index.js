const passport = require("passport");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require('../models/User.model');
const config = require("../config/keys");

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretOrKey;

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({_id: jwt_payload.id}, (err, user) => {
        if(err) {
            return done(err);
        }

        if(user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    })
}))

module.exports = passport;