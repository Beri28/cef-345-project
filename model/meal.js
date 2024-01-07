const mongoose=require('mongoose');
const mealSchema= new mongoose.Schema({
    name:{type:String,required:true},
    image:{type:String,required:true},
    rating:{type:Number},
    rated_by:{type:Number},
    price:{type:String,required:true},
    description:{type:String},
    menu:{type:String},
    promo:{type:Boolean}
})

module.exports=mongoose.model('meal',mealSchema)