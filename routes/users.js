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


router.post('/friends/:userId', function(req, res) {
    // Add ONE friend.

    /*
        TODO: vänner som redan finns ska inte läggas till.
    */
    var id = req.params.userId;

    User.findOne({ _id: id }, function (err, user) {

        user.friends.push(req.body.friendId);

        user.save({ _id: id }, function(err, user) {
            if (err) { console.log(err); }
            res.json(user);
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

var auth = function (req, res, next) {

    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.status(401).json({ err: 'unauthorized' });
    }

    var user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    };


    User.findOne({ username: user.name, password: user.pass }, function(err, acc) {
        if (err) return res.status(500).json(err);

        if (acc) {
            req.user = { username: user.name };
            return next();
        } else {
            return unauthorized(res);
        }
    });
};

/*router.get('/login', auth, function(req, res, next) {

    User.findOne({ username: req.user.username }, function(err, account) {
        if (err) return res.status(500).json(err);
        if (account) {
            return res.status(200).json({
                msg: 'Authenticated!',
                _id: account._id,
                email: account.email,
                username: account.username
            });
        } else {
            return res.status(500).json({
                msg: 'Something terrible happend!'
            });
        }
    });
});*/

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
    var error = [];
    if (!req.body.username) {
        error.push("Missing username.");
    }
    if (!req.body.password) {
        error.push("Missing password.");
    }
    if (!req.body.email) {
        error.push("Missing email.");
    }

    if (req.body.username && req.body.password && req.body.email) {
        var query = User.where({ username: req.body.username });
        query.findOne(function(err, acc) {
            if (err) res.status(500).json(err);

            if (acc) {
                return res.status(400).json({
                    msg: 'A user with that username does already exist.',
                    details: req.body
                });
            } else {

                var account = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
                });

                account.save();

                return res.status(201).json({
                    msg: 'A new account was created!',
                    details: {
                        id: account._id,
                        email: account.email,
                        username: account.username
                    }
                });
            }
        });
    } else {
        return res.status(400).json({
            msg: 'Failed to meet the required fields.',
            details: error
        });
    }
});

module.exports = router;
