var mongoose = require('mongoose');

var genderTypes = ["Male", "Female"];

var User = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    birthday: {
        type: Date
    },
    gender: {
        type: String,
        enum: genderTypes
    },

    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('User', User);
