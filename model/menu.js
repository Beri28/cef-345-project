const mongoose=require('mongoose')
const menuSchema=new mongoose.Schema({
    mealId:{type:[String],required:true},
    menuType:{type:String,required:true}
})

module.exports=mongoose.model('menu',menuSchema)