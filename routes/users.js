var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Message = require('../models/Message');


var i = 0;

router.get('/', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

router.get('/')

router.post('/add', function(req, res) {
    var user = new User({
        username: "test " + ++i,
        email: "test@asd.com" + i,
        password: "test",
        birthday: Date.now(),
        gender: "Female"
    });

    user.save(function (err) {
        if (err) {
            console.log(err);
            res.json(err);
        }

        var message = new Message({
            fromId: user._id,
            toId: "565ef6114957b149262c1e05",
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
    });
});


module.exports = router;
