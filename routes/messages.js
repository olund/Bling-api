var express = require('express');
var router = express.Router();

var Message = require('../models/message');

router.get('/', function(req, res) {
    Message.find({}, function(err, messages) {
        res.json(messages);
    });
});


router.post('/', function(req, res) {

    var message = new Message({
        fromId: req.body.fromId,
        toId: req.body.toId,
        type: req.body.type,
        body: req.body.body,
        created: Date.now()
    });

    message.save(function (err) {
        if (err) {
            console.log(err);
            res.json(err);
        }
        res.json(message);
    });
});

module.exports = router;
