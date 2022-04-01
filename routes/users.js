const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost/taskList")
const userSchema=mongoose.Schema({
  name:String,
  password:String,
  tasks:Array
})

module.exports=mongoose.model("userData",userSchema);
