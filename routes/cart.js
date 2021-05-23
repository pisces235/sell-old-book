var express = require('express');
var router = express.Router();

var Book = require('../models/Book');

router.get('/', function(req, res, next){
    res.render('index')
});

module.exports = router;