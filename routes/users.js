const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost/taskList")
const userSchema=mongoose.Schema({
  name:{
    type:String,
    unique:true
  },
  password:String,
  tasks:Array
})

module.exports=mongoose.model("userData",userSchema);
