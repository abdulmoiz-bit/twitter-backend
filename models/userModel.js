const mongoose = require('mongoose')
//const Tweet = require('./tweetModel')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "a user must have a name"]
    },
    email: {
        type: String,
        required: [true, "a user must have a email address"],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "a user must have a password"],
        minlength: 8
    },
   followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
   ],
   following: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
   ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;



