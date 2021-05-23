var express = require('express');
var router = express.Router();
var Book = require("../models/Book");
var csrf = require('csurf');
var passport = require('passport');


var csrfProtection = csrf();
router.use(csrfProtection);


router.get('/', isLoggedIn, function(req, res, next){
  res.render('admin/index');
});

router.get('/logout', isLoggedIn, function(req, res, next){
  req.logout();
  res.redirect('/admin')
})

router.use('/', notLoggedIn, function(req, res, next){
  next();
})

router.get('/signin', function(req, res, next){
  var messages = req.flash('error');
    res.render("admin/signin", { csrfToken:  req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});
router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/admin/index',
  failureRedirect: 'admin',
  failureFlash: true,
}));



module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/user/signin');
}
function notLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}