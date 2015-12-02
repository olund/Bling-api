var mongoose = require('mongoose');

var types = ["Position", "Distance", "FriendRequest"];

var Message = new mongoose.Schema({
    fromId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    toId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: types
    },
    body: {
        type: String
    }
//      fans     : [{ type: Number, ref: 'Person' }]

});

module.exports = mongoose.model('Message', Message);
