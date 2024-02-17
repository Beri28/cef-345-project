const mongoose=require('mongoose');
const dataSchema= new mongoose.Schema({
    Data:[type:[String]}
})

module.exports=mongoose.model('data',dataSchema)
