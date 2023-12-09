const mongoose=require('mongoose');
const mealSchema= new mongoose.Schema({
    name:String,
    addOns:String,
    price:Number
})

module.exports=mongoose.model('meal',mealSchema)