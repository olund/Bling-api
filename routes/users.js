var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Message = require('../models/message');

var i = 0;

router.get('/', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

router.get('/:username', function(req, res) {
    User.findOne({ username: req.params.username })
        .populate('friends')
        .exec(function (err, user) {

            Message.find({ toId: user._id }, function(err, messages) {
                console.log(messages);
            });

            if (err) console.log(err);
            res.json(user);
        });
});

router.delete('/:userId', function(req, res) {
    var id = req.params.userId;

    User.remove({
        _id: id
    }, function(err, user) {
        if (err) {
            console.log(err);
        }
        res.json({ user: user, message: 'User removed' });
    });
});

router.put('/:userId', function(req, res) {
    var id = req.params.userId;

    User.update({ _id: id }, req.body, function(err, user) {
        if (err) { console.log(err); }
        res.json(user);
    });

});

router.post('/add', function(req, res) {
    var user = new User({
        username: "kalle",
        email: "test@asd.com",
        password: "test",
        birthday: Date.now(),
        gender: "Female",
    });

    var user2 = new User({
        username: "Henke",
        email: "henke@asd.com",
        password: "test",
        birthday: Date.now(),
        gender: "Male"
    });

    user.friends.push(user2);
    user2.friends.push(user);

    user.save(function (err) {
        if (err) {
            console.log(err);
            res.json(err);
        }

        user2.save(function (err) {
            if (err) {
                console.log(err);
                res.json(err);
            }

            res.json(user);
        });

        /*var message = new Message({
            fromId: user._id,
            toId: user._id,
            type: "Distance",
            body: "58km"
        });

        message.save(function (err) {
            if (err) {
                console.log(err);
                res.json(err);
            }
            res.json(user);
        });
        */
    });
});

router.get('/messages/:userId', function(req, res) {
    var limit = req.query.amount ? req.query.amount : 0;

    Message.find({
        toId: req.params.userId
    })
    .populate('fromId', 'username')
    .limit(limit)
    .sort({ created: -1 })
    .exec(function (err, messages) {
        if (err) {
            console.log(err);
            res.json(err);
        }
        res.json(messages);
    });
});


module.exports = router;
