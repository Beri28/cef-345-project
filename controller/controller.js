const userSchema=require('../model/user')
const mealSchema=require('../model/meal')
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

const getMeals= async (req,res)=>{
    try {
        let results=await mealSchema.find({});
        if(req.session.cart){
            results.push(req.session.cart.totalQty)
            res.send(results)
        }
        else{
            results.push(0)
            res.send(results)        
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

exports.saveNewUser=saveNewUser
exports.saveNewMeal=saveNewMeal;
exports.getMeals=getMeals;
exports.loginUser=loginUser
exports.logoutUser=logoutUser