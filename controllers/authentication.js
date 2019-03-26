const User = require('../models/user')
const jwt = require('jwt-simple')
const config = require('../config')

tokenForUser = user => {
  const timestamp = new Date().getTime()
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signin = function(req, res, next) {
  //User has already had their email and password auth`d
  //need to send them token

  res.send({ token: tokenForUser(req.user) })
}

exports.signup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' })
  }

  //See if a user with given email exists
  User.findOne({ email }, (err, existingUser) => {
    if (err) {
      return next(err)
    }
    //If a user with email does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' })
    }
    //If a user with email doesn't exist, create a user and save record
    const user = new User({ email, password })
    user.save(err => {
      if (err) {
        return next(err)
      }
      //Res to req indicating user was created
      res.json({ token: tokenForUser(user) })
    })
  })
}
