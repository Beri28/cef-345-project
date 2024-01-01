const express=require('express');
const router=express.Router();
const mealSchema=require('../model/meal')
const {saveNewUser,saveNewMeal,getMeals, loginUser,logoutUser}=require('../controller/controller');
const passport = require('passport');
const Cart=require('../model/cart')


const isLoggedIn=(req,res,next)=>{
    if(req.isAuthenticated()){
       return next()
    }
    res.redirect('/login')
}
const notLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
       return next()
    }
    res.redirect('/userAccount')
}

router.route('/home').get(isLoggedIn,(req,res)=>{
    res.send("Hello from home <a href='/logout'>logout</a>")
})
router.get('/login',notLoggedIn,(req,res)=>{
    //res.sendFile('login.html',{root:'./public'})
    res.render('login',{layout:'login',message:req.flash('error')})

})
router.get('/register',notLoggedIn,(req,res)=>{
    //res.sendFile('register.html',{root:'./public'})
    res.render('register',{layout:'register',message2:req.flash('error')})
})

router.route('/add').get((req,res)=>{
    res.sendFile('add.html',{root:'./public'})
})
// .post(saveNewMeal)
router.route('/add-to-cart/:id').get((req,res)=>{
    let mealId=req.params.id
    let cart=new Cart(req.session.cart? req.session.cart:{})
    mealSchema.findById(mealId,(err,meal)=>{
        if(err){
            return res.redirect('/home2')
        }
        cart.add(meal,meal.id)
        req.session.cart=cart;
        res.send(`${req.session.cart.totalQty}`)
    })
}).post((req,res)=>{
    
})

router.get('/cart',(req,res)=>{
    if(req.isAuthenticated()){
        res.render('cart',{layout:'cart',origin:'/userAccount',qnty:(req.session.cart)?req.session.cart.totalQty:0})
    }
    else{
        res.render('cart',{layout:'cart',origin:'/',qnty:(req.session.cart)?req.session.cart.totalQty:0})
    }
})
router.get('/cartItems',(req,res)=>{
    if(req.session.cart){
        res.send([req.session.cart.items,req.session.cart.totalPrice])
    }else{
        res.send({message:"Add items to cart"})
    }
})

router.get('/userAccount',isLoggedIn,(req,res)=>{
    if(req.user.account_Type=='customer'){
        res.render('main',{name:req.user.name})
    }
    if(req.user.account_Type=='restaurant-manager'){
        res.render('admin',{layout:'admin',name:req.session.name})
    }
})
router.get('/userAccount2',isLoggedIn,(req,res)=>{
    res.render('admin',{layout:'admin',name:req.session.name})
})

router.get('/logout',isLoggedIn,logoutUser)

//router.post('/login',loginUser)
router.post('/login',passport.authenticate('local-signin',{
    successRedirect:'/userAccount',
    failureRedirect:'/login',
    failureFlash:true
}))

//router.post('/register',saveNewUser)
router.post('/register',passport.authenticate('local.signup',{
    successRedirect:'/userAccount',
    failureRedirect:'/register',
    failureFlash:true
}))

router.get('/getMeals',getMeals)
router.post('/checkout',isLoggedIn,(req,res)=>{
    res.render('checkout',{layout:'checkout'})
})
router.post('/search',(req,res)=>{
    console.log(req.body)
    mealSchema.find({name:{$regex:req.body.search,$options:'i'}},(err,result)=>{
        if(err){
            return res.send(err)
        }else{
            console.log(result)
            let searchContent=''
            result.forEach(element => {
                searchContent+=`
                <div class="col-lg-3 col-10 rounded3 py-5 mb-lg-2 mb-5 position-relative">
                                <img src="./assets/images/${element.image}" class="position-absolute w-50 rounded-circle shadow-2 food-pic" alt="">
                                <div class="border rounded3 food-info">
                                    <p>${element.name}</p>
                                    <p>${element.rating}</p>
                                    <p>${element.price} FCFA</p>
                                    <p style="display: none;">${element._id}</p>
                                    <a href="#" data-bs-toggle="modal" data-bs-target="#exampleModalCenteredScrollable">
                                        <p class="more">See more...</p>    
                                    </a>
                                    <!--button class="btn btn-outline-orange-2" ><a href="/add-to-cart/${element._id}" class="add-button" style="color:orange;">Add to cart</a></button-->
                                    <button class="btn btn-outline-orange-2 add-2-cart" >Add to cart</button>
                                </div>
                </div>
                `
            });
            if(req.isAuthenticated()){res.render('search',{layout:'search',origin:'/userAccount',qnty:(req.session.cart)?req.session.cart.totalQty:0,results:searchContent})}else{res.render('search',{layout:'search',origin:'/',qnty:(req.session.cart)?req.session.cart.totalQty:0,results:searchContent})}
        }
    })
    //res.render('search',{layout:'search'})
})

module.exports=router;