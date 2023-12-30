const express=require('express');
const router=express.Router();


router.post('/login',(req,res)=>{
    res.send("Login succesful")
})
router.post('/register',(req,res)=>{
    res.send(" succesful")
})

module.exports=router;