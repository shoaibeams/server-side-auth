const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

//Define our model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
})

//On Save Hook, encrypt password
//Before saving model, run this func
userSchema.pre('save', function(next) {
  //get access to user model
  const user = this
  //gen a salt autmatically & combine it with hashed pw
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err)
    }

    //overwrite plain text pw with hashed pw
    user.password = hash
    next()
  })
})

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return callback(err)
    }
    callback(null, isMatch)
  })
}

//Create model class
const ModelClass = mongoose.model('user', userSchema)

//Export the model
module.exports = ModelClass
