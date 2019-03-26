const passport = require('passport')
const User = require('../models/user')
const config = require('../config')
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local')
const ExtractJwt = require('passport-jwt').ExtractJwt

//Create a Local Strategy
const localOptions = { usernameField: 'email' }

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  //Verify credintials, call done with user
  //if correct credintials, else
  //call done with false
  User.findOne({ email }, function(err, user) {
    if (err) {
      return done(err)
    }
    if (!user) {
      return done(null, err)
    }

    //compare passwords - is `password` equal to user.password
    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        return done(err)
      }
      if (!isMatch) {
        return done(null, false)
      }

      return done(null, user)
    })
  })
})

//Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
}

//Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  //see if userid in payload exists in db
  //if it does, call 'done' with user,
  //else call without it

  User.findById(payload.sub, (err, user) => {
    if (err) {
      return done(err, false)
    }
    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  })
})

//Tell Passport to use the strategy
passport.use(jwtLogin)
passport.use(localLogin)
