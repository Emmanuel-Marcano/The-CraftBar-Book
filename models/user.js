const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

// it adds to the userSchema the username and password fields
UserSchema.plugin(passportLocalMongoose) 
const User = mongoose.model('User', UserSchema)
module.exports = User


