var express = require('express');
var router = express.Router();

var Message = require('../models/message');

router.get('/', function(req, res) {
    Message.find({}, function(err, messages) {
        res.json(messages);
    });
});

router.post('/add', function(req, res) {
    var fId = 0;
    var toId = 1;

    var msg = new Message({
        fromId: ++fId,
        toId: ++toId,
        type: "Position",
        body: "Test"
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
