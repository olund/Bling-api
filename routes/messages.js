var express = require('express');
var router = express.Router();

var Message = require('../models/message');

router.get('/', function(req, res) {
    Message.find({}, function(err, messages) {
        res.json(messages);
    });
});

router.post('/add', function(req, res) {


    var msg = new Message({
        fromId: "565f05bb0b2cd11b29085304",
        toId: "565f05bb0b2cd11b29085305",
        type: "position",
        body: "Testar från kalle"
    });

    msg.save(function (err) {
        if (err) {
            console.log(err);
            res.json(err);
        }
        res.json(msg);
        console.log("added message");
    });

});



module.exports = router;
