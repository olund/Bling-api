var express = require('express');
var router = express.Router();

var Message = require('../models/message');

var msg = {
    id: 1,
    fromId: 1,
    toId: 2,
    type: "Position",
    body: "Test"
};

router.get('/', function(req, res) {
    res.json(msg);
});

module.exports = router;
