const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/User.model');
const bcrypt = require("bcrypt");

passport.use(new LocalStrategy({usernameField: "email"}, function(email, password, done) {
    User.findOne({email: email}, (err, user) => {
        if(err)
            return done(err);
        
        if(!user)
            return done(null, false);

        bcrypt.compare(password, user.password, (err, isCorrect) => {
            if(!isCorrect)
                return done(null, false);
        })

        return done(null, user);
    })
}))