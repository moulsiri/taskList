var express = require('express');
var router = express.Router();
const passport=require('passport');
const local=require('passport-local')
const db=require('./users')
passport.use(new local(db.authenticate()));
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/');
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/signup', function(req, res, next) {
  res.render('signUp');
});


router.get('/profile',isLoggedIn,function(req,res){
 db.findOne({
   username:req.session.passport.user
 }).then(function(data){
   res.render('profile',{data})
 })
  // res.send(req.session.passport.user);
})

router.post('/register',function(req,res){
  let nUser=new db({
    name:req.body.name,
    username:req.body.username
  })
  db.register(nUser,req.body.password)
  .then(function(u){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/profile')
    })
  })
  .catch(function(e){
    res.send(e);
  })
})


router.post('/login',passport.authenticate('local',{
  successRedirect:'/profile',
  failureRedirect:'/'
}),function(req,res,next){ });


router.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
module.exports = router;
})

router.get('/createTask',function(req,res){
  db.findOneAndUpdate({
    username:req.session.passport.user
  },{
    $push:{tasks:{taskName:req.query.task,
    done:false}}
  }).then(function(){
    res.redirect('/profile')
  })
})

router.get('/deleteTask/:t',function(req,res){
  db.findOneAndUpdate({
    username:req.session.passport.user
  },{
    $pull:{tasks:{taskName:req.params.t}}
  }).then(function(){
    res.redirect('/profile')
  })
})
router.get('/showTask/:t',function(req,res){
  db.findOne({
    username:req.session.passport.user
  }).then(function(data){
    res.render('task',{data:data.tasks[req.params.t],id:req.params.t})
  })
})
router.post('/updateTask/:id',function(req,res){
  db.findOneAndUpdate({
    username:req.session.passport.user,
    "tasks.taskName":req.params.id
  },{
    $set: { "tasks.$.done" : (req.body.check)?true:false,
           "tasks.$.taskName":req.body.taskName }
  }).then(function(){
    res.redirect('/profile')
  })
 
})
module.exports = router;
