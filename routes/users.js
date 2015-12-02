var express = require('express');
var router = express.Router();

var User = require('../models/user');

var user = {
    id: 1,
    username: "test",
    email: "test",
    password: "test"
};

router.get('/', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });

});

module.exports = router;
