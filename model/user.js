const mongoose=require('mongoose');
const bcrypt=require('bcrypt')
const userSchema= new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    address:{type:String,required:true},
    contact:{type:String,required:true},
    account_Type:{type:String,required:true},
},{timestamps:true})
userSchema.methods.encryptPassword=async (password)=>{
    console.log(typeof(bcrypt.hashSync(password,8)))
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null)
}
userSchema.methods.validPassword=function (password){
    return bcrypt.compareSync(password,this.password)
}
module.exports=mongoose.model('user',userSchema);