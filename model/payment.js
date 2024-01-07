const mongoose=require('mongoose')
const paymentSchema=new mongoose.Schema({
    amount:{type:Number,required:true},
    userId:{type:String,required:true},
    mealId:{type:[String],required:true}
},{timestamps:true})

module.exports=mongoose.model('payment',paymentSchema)