var express = require('express');
const res = require('express/lib/response');
var router = express.Router();
const userData=require('./users')

router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/newUser',function(req,res){
  res.render('signUp')
})

router.post('/createUser',function(req,res){
  userData.create({
    name:req.body.n,
    password:req.body.p
  }).then(()=>{
    res.redirect('/')
  })
})

router.post('/taskApp',function(req,res){
  userData.findOne({
    name:req.body.user
  }).then(function(data){
    if(data.password===req.body.pass){
      // res.send(data)
      // res.render("taskApp",{userData:data})
    res.redirect(`/taskApp/${data._id}`)

    }
    else{
      res.send("invalid User!")
    }
    
  })
  .catch(()=>{
    res.send("No user found! please make your account in signUp section")
  })
})

router.get('/creatTask/:id',function(req,res){
userData.findOneAndUpdate({
  _id:req.params.id
},{ $push: { tasks: {
  taskName:req.query.task,
  done:false
} } }).then(function(){
  res.redirect(`/taskApp/${req.params.id}`)

})
})
router.get("/taskApp/:id",function(req,res){
  userData.findOne({
    _id:req.params.id
  }).then(data=>{
    res.render("taskApp",{userData:data})

  })
})
router.get("/deleteTask/:id/:t",function(req,res){
  userData.findOneAndUpdate({
    _id:req.params.id
  },{$pull:{tasks:{taskName:req.params.t}}}).then(function(){
    res.redirect(`/taskApp/${req.params.id}`)
  })
})






module.exports = router;
