const express=require('express');
const router=express.Router();
const mealSchema=require('../model/meal')
const userSchema=require('../model/user')
const {saveNewUser,saveNewMeal,getMeals, loginUser,logoutUser,paymentDetails,
    addToTodaysMenu,removeFromTodaysMenu,addToPromoMenu,removeFromPromoMenu,deleteMeal,getManagers}=require('../controller/controller');
const passport = require('passport');
const Cart=require('../model/cart')


const isLoggedIn=(req,res,next)=>{
    if(req.isAuthenticated()){
       return next()
    }
    else{
        //req.session.tempUser.cart=req.session.cart
        req.session.tempUserCart=req.session.cart
    }
    res.redirect('/login')
}
const notLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
       return next()
    }
    res.redirect('/userAccount')
}

router.route('/superAdmin').get((req,res)=>{
    res.sendFile('super.html',{root:'./public'})
})
router.get('/getManagers',getManagers)
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
router.post('/deleteMeal',deleteMeal)
router.post('/addToTodaysMenu',addToTodaysMenu)
router.post('/rTodaysMenu',removeFromTodaysMenu)
router.post('/addToPromoMenu',addToPromoMenu)
router.post('/rPromoMenu',removeFromPromoMenu)


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
        res.send([req.session.cart.items,req.session.cart.totalPrice,req.session.cart.totalQty])
    }else{
        res.send({message:"Add items to cart"})
    }
})
router.get('/checkoutItems',(req,res)=>{
    if(req.session.cart){
        res.send([req.session.cart.items,req.session.cart.totalPrice])
    }else{
        res.send({message:"Add items to cart"})
    }
})
router.post('/updateCart',(req,res)=>{
    let OgQnty=parseInt(req.body.qnty)
    let diff;
    if(OgQnty>req.session.cart.items[req.body.ID].qty){
        diff=OgQnty - req.session.cart.items[req.body.ID].qty
        parseInt(diff)
        req.session.cart.items[req.body.ID].price=parseInt(req.body.amt)
        req.session.cart.items[req.body.ID].qty=parseInt(req.body.qnty)
        req.session.cart.totalPrice=parseInt(req.body.tAmt)
        req.session.cart.totalQty=req.session.cart.totalQty+diff
    }else if(OgQnty<req.session.cart.items[req.body.ID].qty){
        diff=req.session.cart.items[req.body.ID].qty -OgQnty
        parseInt(diff)
        req.session.cart.items[req.body.ID].price=parseInt(req.body.amt)
        req.session.cart.items[req.body.ID].qty=parseInt(req.body.qnty)
        req.session.cart.totalPrice=parseInt(req.body.tAmt)
        req.session.cart.totalQty=req.session.cart.totalQty-diff
    }
    res.status(200).send({status:"OK"})
})
router.post('/deleteCartItem',(req,res)=>{
    let toBeDeleted=req.body.ID
    req.session.cart.items[toBeDeleted]
    let qnty=req.session.cart.items[toBeDeleted].qty
    let price=req.session.cart.items[toBeDeleted].price
    req.session.cart.totalQty=req.session.cart.totalQty-qnty
    req.session.cart.totalPrice=req.session.cart.totalPrice-price
    delete req.session.cart.items[toBeDeleted]
    res.send(`${req.session.cart.totalPrice}`)
})
router.get('/userAccount',isLoggedIn,(req,res)=>{
    if(req.user.account_Type=='customer'){
        res.render('main',{name:req.user.name})
    }
    if(req.user.account_Type=='restaurant-manager'){
        //validate(req,res)
        res.redirect('/validateManager')
        //res.render('admin',{layout:'admin',name:req.user.name})
    }
    if(req.user.account_Type=='delivery-agent'){
        res.render('delivery',{layout:'delivery',name:req.user.name})
    }
})
router.get('/userAccount2',isLoggedIn,(req,res)=>{
    res.render('admin',{layout:'admin',name:req.user.name})
})
router.get('/validateManager',(req,res)=>{
    console.log(req.user.isValidated)
    if(req.user.isValidated){
        return res.render('admin',{layout:'admin',name:req.user.name})
    }
    res.render('validate',{layout:'validate'})
}).post('/validateManager',(req,res)=>{
    userSchema.findByIdAndUpdate(req.body.managerID,{$set:{isValidated:true}},(err,result)=>{
        if(err){
            console.log(err)
            return
        }
        res.send({message:"Updated"})
    })
})
router.post('/managerCode',async(req,res)=>{
    console.log(req.body)
    console.log(req.user)
    if(req.user.code==req.body.code){
        //await userSchema.findOneAndUpdate({email:req.user.email},{$set:{isValidated:true}})
        res.render('admin',{layout:'admin',name:req.user.name})
    }
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
router.get('/dv',(req,res)=>{
    res.render('delivery',{layout:'delivery'})
})
router.get('/getMeals/:type',getMeals)
router.post('/checkout',isLoggedIn,(req,res)=>{
    res.render('checkout',{layout:'checkout'})
})
router.get('/paymentDetails',paymentDetails)
router.post('/search',(req,res)=>{
    console.log(req.body)
    mealSchema.find({name:{$regex:req.body.search,$options:'i'}},(err,result)=>{
        let searchContent=''
        if(err){
            return res.send(err)
        }else if((!result) || (result==[])){
            console.log("Not ofund")
            searchContent=`<div class="h3 d-flex row justify-content-center">No such meal available.</div>`
            return
        }
        else{
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
        }
        if(searchContent==''){
            searchContent=`<div class="h3 d-flex row justify-content-center mb-3">No such meal available yet.</div>`
        }
        if(req.isAuthenticated()){
            res.render('search',{layout:'search',origin:'/userAccount',qnty:(req.session.cart)?req.session.cart.totalQty:0,results:searchContent})
        }
        else{
            res.render('search',{layout:'search',origin:'/',qnty:(req.session.cart)?req.session.cart.totalQty:0,results:searchContent})
        }
    })
    //res.render('search',{layout:'search'})
})

module.exports=router;
