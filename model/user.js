const mongoose=require('mongoose');
const userSchema= new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    contact:{type:String,required:true},
    account_Type:{type:String,required:true},
},{timestamps:true})

module.exports=mongoose.model('user',userSchema);