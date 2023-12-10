const express=require('express');
const router=express.Router();
const mealSchema=require('../model/meal')
const {saveNewUser,saveNewMeal,getMeals, loginUser,logoutUser}=require('../controller/controller')

let cartItems=[]
const isAuth=async(req,res,next)=>{
    if(req.session.isAuth){
        next()
    }
    else{
        res.redirect('./login.html')
    }
}

router.route('/home').get((req,res)=>{
    console.log(req.session)
    res.send("Hello from routes")
})

router.route('/add').get((req,res)=>{
    res.sendFile('add.html',{root:'./public'})
}).post(saveNewMeal)

router.route('/cartItem').get((req,res)=>{
        res.send(cartItems)
}).post((req,res)=>{
    if(cartItems.includes(req.body.item)){
        console.log("already added to cart");
    }
    else{
        cartItems.push(req.body.item);
    }
})

router.get('/userAccount',isAuth,(req,res)=>{

        //res.render('admin',{name:req.session.name})
        res.render('main',{name:req.session.name})
})
router.get('/userAccount2',isAuth,(req,res)=>{

    res.render('admin',{layout:'admin',name:req.session.name})
    //res.render('main',{name:req.session.name})
})
router.get('/logout',logoutUser)

router.post('/login',loginUser)

router.post('/register',saveNewUser)

router.get('/getMeals',getMeals)
router.post('/checkout',isAuth,(req,res)=>{
    res.render('checkout',{layout:'checkout'})
})

module.exports=router;
