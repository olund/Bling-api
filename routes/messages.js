var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Message = require('../models/message');

router.get('/', function(req, res) {
    Message.find({}, function(err, messages) {
        res.json(messages);
    });
});


router.post('/:username?', function(req, res) {

    var toId = req.body.toId;
    var username = req.params.username;
    var message;

    if (username) {
        console.log('kördes med params');
        User.findOne({ username: username }, function (err, user) {
            if (err) { res.json(err); console.log(err); }

            if (user) {
                message = new Message({
                    fromId: req.body.fromId,
                    toId: user._id,
                    type: req.body.type,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude,
                    read: req.body.read,
                    created: new Date().getTime()
                });

                message.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.json(err);
                    }
                    res.json(message);
                });
                return;
            }

            return res.json({ err: 404 });

        });

    } else {
        console.log('kördes med body');
        message = new Message({
            fromId: req.body.fromId,
            toId: toId,
            type: req.body.type,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            read: req.body.read,
            created: new Date().getTime()
        });

        message.save(function (err) {
            if (err) {
                console.log(err);
                res.json(err);
            }
            res.json(message);
        });
    }
});


router.put('/:id', function(req, res) {

    Message.update({ _id: req.params.id}, req.body, function(err, msg) {
        if (err) { res.json(err); }
        if (msg) {
            return res.json(msg);
        } else {
            return res.json({ "msg": "Message to update not found" });
        }

    });

});


module.exports = router;
