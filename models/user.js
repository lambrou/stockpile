var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true }
    },
    { collection: 'users'} 
)

var models = mongoose.model('UserSchema', UserSchema)

module.exports = models