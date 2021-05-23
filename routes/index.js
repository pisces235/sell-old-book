var express = require('express');
var router = express.Router();
var Book = require("../models/Book");
var types = require("../models/types");
var csrf = require('csurf');




/* GET home page. */
router.get('/', function(req, res, next) {
  delete req.session.cart
  Book.find(function(err, books){
    if(err) console.log(err);
    res.render("index", { books });
  });
});

router.get('/books', function(req, res, next){
  Book.find(function(err, books){
    if(err) console.log(err);
    res.render("books/main", { title: 'All Book', books });
  });
});

router.get('/books/by:type', function(req, res, next){
  var type = req.params.type;
  types.findOne({ name: type }, function(err, t){
    Book.find({ type : type}, function(err, books){
      if(err) console.log(err);
      res.render('books/cat', { t, books });
    })
  });
});

router.get('/books/:slug', function(req, res, next){
  var slug = req.params.slug;
  
  Book.findOne({ slug: slug }, function(err, book){
    if(err) console.log(err);
    Book.find(function(err, books){
    if(err) console.log(err);
    res.render("books/show", { title: 'All Book', book, books });
    });
  });
});


router.get('/add-to-cart/:slug', isLoggedIn, function( req, res, next){
  var BookSlug = req.params.slug;

  Book.findOne({ slug: BookSlug}, function(err, p){
    if(err) console.log(err);

    if(typeof req.session.cart == "undefined"){
      req.session.cart = [];
      req.session.cart.push({
        slug: p.slug,
        title: p.title,
        qty: parseInt(req.query.qty),
        price: p.price,
        image: p.image
      });
    } else{
      var cart =req.session.cart;
      var newItem = true;

      for(var i = 0; i < cart.length; i++){
        if(cart[i].slug == BookSlug){
          cart[i].qty+= parseInt(req.query.qty);
          newItem = false;
          break;
        }
      }
      if(newItem){
        cart.push({
          slug: p.slug,
          title: p.title,
          qty: parseInt(req.query.qty),
          price: p.price,
          image: p.image
        });
      }
    }
    console.log(req.session.cart);
    res.redirect('back');
  });
});

router.get('/shopping-cart', function(req, res){
  res.render('cart', {title: 'Cart', cart: req.session.cart})
})

router.get('/update/:slug', function(req, res){
  var slug = req.params.slug;
  var cart = req.session.cart;
  var action = req.query.action;

  for (var i = 0; i < cart.length; i++){
    if(cart[i].slug == slug){
      switch(action){
        case "add":
          cart[i].qty++;
          break;
        case "remove":
          if(cart[i].qty > 0)
            cart[i].qty--;
          if(cart[i].qty <= 0) cart.splice(i, 1);
          if(cart.length == 0) 
            delete req.session.cart;
          break;
        case "clear":
          cart.splice(i, 1);
          if(cart.length == 0) 
            delete req.session.cart;
          break;
        default:
          console.log("Update problem");
          break;
      }
      break;
    }
  }
  req.flash('succes', 'Book added');
  res.redirect('back');
});

router.get('/clear', (req, res, next) => {
  delete req.session.cart;
  res.redirect('back');
})

module.exports = router;
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/user/signin');
}