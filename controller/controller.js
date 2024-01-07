const userSchema=require('../model/user')
const mealSchema=require('../model/meal')
const paymentSchema=require('../model/payment')
const menuSchema=require('../model/menu')
const bcrypt=require('bcrypt')


const saveNewUser=async (req,res)=>{
    let userRes=await userSchema.findOne({email:req.body.email})
    if(userRes){
        res.redirect('./register.html')
    }
    else{
        let newUser=new userSchema(req.body);
        newUser.save().then(()=>{
            console.log("Register was succesful")
            res.redirect('./login.html')
        }).catch(()=>{
            res.send("Couldn't save")
        })
    }
} 

const saveNewMeal=async (req,res)=>{
    try {
        console.log(req.body)
        let newMeal= new mealSchema(req.body);
        // newMeal.save().then(()=>{
        //     res.send("Saved Meal Succesfully")
        // }).catch(()=>{
        //     res.send("Couldn't save")
        // })
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
const deleteMeal=async (req,res)=>{
    try {
        console.log(req.body)
        let mealpic=await mealSchema.findById(req.body.mealID)
        mealpic=mealpic.image
        console.log(mealpic)
        await mealSchema.findByIdAndDelete(req.body.mealID)
    } catch (error) {
        res.send(error)
    }
}
const getMeals= async (req,res)=>{
    try {
        if(req.params.type=='today'){
            let results=await mealSchema.find({menu:'today'});
            if(req.session.cart){
                results.push(req.session.cart.totalQty)
                res.send(results)
            }
            else{
                results.push(0)
                res.send(results)        
            }
        }
        else if(req.params.type=='promo'){
            let results=await mealSchema.find({menu:'promo'});
            if(req.session.cart){
                results.push(req.session.cart.totalQty)
                res.send(results)
            }
            else{
                results.push(0)
                res.send(results)        
            }
        }
        else{
            let results=await mealSchema.find({});
            if(req.session.cart){
                results.push(req.session.cart.totalQty)
                res.send(results)
            }
            else{
                results.push(0)
                res.send(results)        
            }
        }
    } catch (error) {
        res.send(error)
    }
}

const loginUser=async (req,res)=>{
    console.log('login:',req.body)
    let oldUser=await userSchema.findOne({email:req.body.email});
    if(!oldUser){
        console.log("User with cred doesn't exist")
        res.redirect('./register.html')
    }else{
        bcrypt.compareSync(req.body.password,oldUser.password)
        if(bcrypt.compareSync(req.body.password,oldUser.password)){
            req.session.isAuth=true;
            req.session.name=oldUser.name
            //req.session.account_Type=oldUser.account_Type
            if(oldUser.account_Type=='restaurant-manager'){
                res.redirect('/userAccount2')
            }
            else{
                res.redirect('/userAccount')
            }
        }
        else{
            console.log("Wrong password")
            res.redirect('./login.html')
        }
    }
}
const logoutUser=async(req,res)=>{
    req.logout((err)=>{
        if(err){
            throw(err)
        }
        res.redirect('/')
    })
}
const paymentDetails=async (req,res)=>{
    try {
        paymentSchema.findOne({userId:req.user.id},(err,result)=>{
            if(err){
                console.log(err)
                res.send("There was a db error")
                return
            }
            if((!result) || (result.mealId==undefined)){
                res.send({})
            }else{
                let mealName=''
                mealSchema.find({_id:result.mealId},(err,result2)=>{
                    if(err){
                        // res.send("DB error")
                        // return
                        throw(err)
                    }
                    mealName=result2[0].name
                    result.meal_Name=mealName
                    // res.send({result:result,mealName:mealName})
                    res.send({undefined})
                })
            }
        })
        
    } catch (error) {
        res.send(error)
    }
}
const addToTodaysMenu=async (req,res)=>{
    try {
       console.log(req.body)
       let meal=await mealSchema.findByIdAndUpdate(req.body.mealID,{menu:'today'},{new:true})
       res.send(meal)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
const removeFromTodaysMenu=async (req,res)=>{
    try {
        console.log(req.body)
        let meal=await mealSchema.findByIdAndUpdate(req.body.mealID,{menu:'none'},{new:true})
        res.send(meal)
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"Server error"})
    }
}
const addToPromoMenu=async (req,res)=>{
    try {
        console.log(req.body)
        let meal=await mealSchema.findOneAndUpdate({_id:req.body.mealID},{$set:{promo:true}},{new:true})
        console.log(meal)
        res.send(meal)
    } catch (error) {
        console.log(error)
        res.send({message:"Server error"})
    }
}
const removeFromPromoMenu=async (req,res)=>{
    try {
        console.log(req.body)
        let meal=await mealSchema.findByIdAndUpdate(req.body.mealID,{promo:false},{new:true})
        res.send(meal)
    } catch (error) {
        console.log(error)
        res.send({message:"Server error"})
    }
}
const getManagers=async (req,res)=>{
    try {
        userSchema.find({account_Type:"restaurant-manager"},(err,result)=>{
            if(err){
                console.log(err)
                return
            }
            let aresults=[]
            result.forEach((element)=>{
                if(!element.isValidated){
                    aresults.push(element)
                }
            })
            res.send(aresults)
        })
    } catch (error) {
        throw(error)
    }
}

exports.saveNewUser=saveNewUser;
exports.saveNewMeal=saveNewMeal;
exports.getMeals=getMeals;
exports.loginUser=loginUser;
exports.logoutUser=logoutUser;
exports.paymentDetails=paymentDetails;
exports.addToTodaysMenu=addToTodaysMenu;
exports.removeFromTodaysMenu=removeFromTodaysMenu;
exports.addToPromoMenu=addToPromoMenu
exports.removeFromPromoMenu=removeFromPromoMenu
exports.deleteMeal=deleteMeal
exports.getManagers=getManagers