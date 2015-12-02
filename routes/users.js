var express = require('express');
var router = express.Router();

var User = require('../models/user');



router.get('/', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

router.post('/add', function(req, res) {
    var user = new User({
        id: 1,
        username: "test",
        email: "test@asd.com",
        password: "test",
        birthday: Date.now(),
        gender: "Female"
    });

    user.save(function (err) {
        if (err) {
            console.log(err);
            res.json(err);
        }
        res.json({msg: "added"});
        console.log("added");
    });
});

module.exports = router;
