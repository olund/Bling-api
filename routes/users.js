var express = require('express');
var router = express.Router();
var basicAuth = require('basic-auth');
var passwordHast = require('password-hash');

var User = require('../models/user');
var Message = require('../models/message');

router.get('/', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

router.post('/friends', function(req, res) {
    // Add ONE friend with 2 user id's

    var id1 = req.body.userOneId;
    var id2 = req.body.userTwoId;

    User.findOne({ _id: id1 }, function (err, user1) {
        User.findOne({ _id: id2 }, function (err, user2) {
            if (user1.friends.indexOf(user2._id) > -1) {
                return res.json({ msg: 'FRIEND ALREADY EXISTS' });
            } else {
                user1.friends.push(user2._id);
                user2.friends.push(user1._id);

                user1.save();
                user2.save();

                Message.remove({_id: req.body.messageId }, function(err, message) {
                    if (err) return res.json(err);
                    return res.json({ msg: 'friend added, message deleted' });
                });
            }
        });
    });
});



router.get('/friends/:userId', function(req, res) {
    // Get all friends for a user.

    User.findOne({ _id: req.params.userId }, {
        _id: 0,
        friends: 1
    })
    .populate('friends', 'username')
    .exec(function (err, user) {
        if (err) {
            res.json(err);
            console.log(err);
        }

        res.json(user.friends);
    });
});

// This fucking function fucks up the login stuff..
/*router.get('/:userId', function(req, res) {
    User.findOne({ _id: req.params.userId }, {
        password: 0
    })
    .populate('friends', 'username')
    .exec(function (err, user) {
        if (err) {
            res.json(err);
            console.log(err);
        }
        res.json(user);
    });
});*/


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
    // Example friends.

    var user = new User({
        username: "balle",
        email: "test@asdasdasd.com",
        password: "test",
        birthday: Date.now(),
        gender: "Female",
    });

    var user2 = new User({
        username: "palle",
        email: "henke@asdasd.com",
        password: "test",
        birthday: Date.now(),
        gender: "Male"
    });

    /*user.friends.push(user2);
    user2.friends.push(user);*/

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
        });*/

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

router.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({ username: username}, function(err, user) {
        if (err) {
            return res.json(err);
        }

        if (user) {
            if (password == user.password) {
                res.json(user);
            }
        } else {
            return res.json({ err: 'unauthorized' });
        }
    });
})

router.post('/register', function(req, res) {

    User.findOne({ username: req.body.username }, function(err, acc) {
        if (err) res.status(500).json(err);

        if (acc) {
            return res.status(400).json({
                msg: 'A user with that username does already exist.',
            });
        } else {
            // Create account and save.
            var account = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            });

            account.save(function(err) {
                if (err) { res.status(500).json(err); }

                return res.status(201).json({
                    msg: 'A new account was created!',
                    _id: account._id,
                    email: account.email,
                    username: account.username
                });
            });
        }
    });
});

module.exports = router;
