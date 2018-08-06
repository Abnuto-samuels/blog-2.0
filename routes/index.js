var express = require('express');
var router = express.Router();
var posts = require('../db.json');
var request = require('request');

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Home', posts: posts.post });
});

/* GET Create post. */
router.get('/create', function(req, res, next) {
  res.render('create');
});

router.post('/create', function(req, res, next) {
  // res.(req.body);
  let obj = {
    "title" : req.body.title,
    "author" : req.body.author,
    "date" : req.body.date,
    "content" : req.body.content,
    "story" : req.body.story
  }

  request.post({
    url: 'http://localhost:8000/post',
    body: obj,
    json: true
  },function (error, response, body) {
      res.redirect('/create');
  });
});


router.get('/post/:id', function(req,res,next){
  let urlPath = req.path;
  let postId = urlPath.slice(-1);
  res.render('blog', {
    posts: posts.post[postId -1]
  })
});

router.get('/delete/:id', function(req,res,next){
  request ({
    url: "http://localhost:8000/post/" + req.params.id,
    method: "Delete",
  }, function(error, response, body){

    res.redirect('/archive');
  });
});

/* GET EDIT post. */
router.get('/edit/:id', function(req, res, next) {
  var id = req.params.id;
  var data = posts.post[id-1];
  res.render('edit', { posts:data });
});


// Get edit
router.post('/edit/:id', function(req, res, next) {


  request({
    url: 'http://localhost:8000/post/'+ req.params.id,
    method:"PATCH",

    form: {
      "title" : req.body.title,
      "author" : req.body.author,
      "date" : req.body.date,
      "image":req.body.image,
      "content" : req.body.content,
      "story" : req.body.story,
    }

  },function (error, response, body) {
    res.redirect('/edit');
  });
});



/* GET archive */
router.get('/archive', function(req, res, next) {
  res.render('archive', { posts: posts.post });
});

/* GET login */
router.get('/', function(req, res, next) {
  res.render('login');
});

/* POST sign in*/
router.post('/', function (req, res, next) {
 var users = posts.users;
 console.log(users);

 var username = req.body.username;
 var password = req.body.password;

 // console.log("Username: "+username+"======="+" Password: "+password);

 for (let i = 0; i < users.length; i++) {
   const user = users[i];
   console.log(user);
       if (username === user.username &&  password == user.password) {
     res.redirect('/home');
   } else {
     res.redirect('/signup');
   }

 }
});


router.get('/signup', function(req, res, next){
 res.render('signup', {
   title: 'Sign Up'
 }
);
});

//GET SIGNUP PAGE
router.post('/signup', function (req, res, next) {
var id = posts.users[posts.users.length-1].id + 1;


var obj = {
 "id": req.body.id,
 "username": req.body.username,
 "password": req.body.password,
 "email": req.body.email
}
request.post({

 url: "http://localhost:8000/users",
 body: obj,
 json: true

}, function (error, response, body) {
res.redirect('/');

});
});

module.exports = router;
