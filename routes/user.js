var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Post = require('../models/posts');


function ensureAuthenticated(req , res , next){
  if(req.isAuthenticated()){
    next();
    }
  else{

    res.redirect('/');
  }
}

// Home Page and getting all posts

router.get('/',(req,res,next)=>{
  Post.find({})
  .sort()
  .exec(function(err,posts){
    if(err) return next(err);

  if(req.isAuthenticated()){
    var userInfo = req.user.twitter;
    var id = userInfo.id;
    var username = userInfo.username;
    var displayName = userInfo.displayName;
    var profilePic = userInfo.profilePic;
    res.render('loggedin' , {userId : id , username : username , displayName : displayName , profilePic :profilePic , posts : posts});

  }else{
    res.render('home' ,{ posts : posts});
  }
  });
});


// creating post START

router.get('/create',ensureAuthenticated, function(req,res,next){
  res.render('addpost');
});

router.post('/create', ensureAuthenticated , function(req,res,next){
  var imageUrl = req.body.imageUrl;
  var description = req.body.description;
  var sliced = imageUrl.slice(0,4);
  if(sliced === 'http' || sliced === 'data'){

    imageUrl = req.body.imageUrl;
  }
  else {
    imageUrl = 'https://cdn.glitch.com/7accb30d-5be4-43dd-b9ce-6a554aefba66%2Fplaceholder.gif?1510702209312';
  }
  User.findById({_id : req.user._id}, function(err,user){
    if(err) return next(err);

      var post = new Post({
      postedBy : req.user._id,
      displayName : req.user.twitter.displayName,
      username : req.user.twitter.username,
      image : imageUrl,
      description: description
    });
    post.save(function(err){
      if(err) return next(err);
      res.redirect('/');
    })
  })
});

// Start for particular user

router.get('/getPost/:user',function(req,res,next){
  var username = req.params.user;
  var userLogged = req.user;
  Post.find({username : username}, function(err,posts){
      res.render('userposts',{username : username , posts: posts , userLogged : userLogged});
  });

});

//deleting post

router.post('/getPost/:user/:postId',ensureAuthenticated,function(req,res,next){
  var toDelete = req.params.postId;
  var user = req.params.user;
  Post.findByIdAndRemove(toDelete,function(err,post){
    if(err) return next(err);
    res.redirect('/getPost/'+ user);
  });
});

// liking a post

router.post('/like/:postId',function(req,res,next){

  if(req.user === undefined){

    req.flash('info', 'Please Login first.')
    res.redirect('/');
  }else{
    Post.findOne({likedBy : req.user._id}, function(err, user){
      console.log(user);
    });
      var user = req.user._id;

      var postId = req.params.postId;
      Post.findOne({_id: postId},function(err,post){
        if(err) return next(err);
        Post.update({_id : post._id}  ,{ $push : { likedBy :  user } , $inc : { likes : 1}}  , function(err){
          if(err) return next(err);
          res.redirect('/');
        });
    });
  }

});

// creating post END


// authenticating twitter
router.get('/auth/twitter',
  passport.authenticate('twitter'));

router.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

  // logging out

  router.get('/logout', ensureAuthenticated, function(req,res,next){
    req.logout();
    res.redirect('/');
  })
module.exports = router;
