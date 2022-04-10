const mdb=require('mongoose');
const plm=require('passport-local-mongoose');
mdb.connect('mongodb://localhost/tasks');
const schema=mdb.Schema({
  name:String,
  username:{
    type:String,
    unique:true
  },
  password:String,
  tasks:Array
})


schema.plugin(plm);
module.exports=mdb.model('users',schema);
