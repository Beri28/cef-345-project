const passport=require('passport')
const userSchema=require('../model/user')
const LocalStrategy=require('passport-local').Strategy

passport.serializeUser((user,done)=>{
    done(null,user._id)
})
passport.deserializeUser((id,done)=>{
    userSchema.findById(id,(err,user)=>{
        done(err,user)
    })
})

passport.use('local.signup',new LocalStrategy({
    usernameField:'email',
    passwordField: 'password',
    passReqToCallback:true
},async (req,email,password,done)=>{
    await userSchema.findOne({email:email},async(err,user)=>{
        if(err){
            return done(err)
        }
        if(user){
            return done(null,false,{message:`<p class="mx-md-4 bg-warning w-md-100" style="padding: 1em 2em;display: flex;justify-content: flex-start;border-radius: 10px;width: max-content;">Email is already in use! <a href="/login" style="font-weight: 900;">&#160;&#160;&#160; Login here</a></p>`})
        }
        req.body.password
        let newUser=new userSchema()
        newUser.name=req.body.name
        newUser.email=email
        newUser.password=await newUser.encryptPassword(password)
        newUser.address=req.body.address
        newUser.contact=req.body.contact
        newUser.account_Type=req.body.account_Type
        newUser.save((err,result)=>{
            if(err){
                return done(err);
            }
            return done(null,newUser)
        })
    }).clone()
}))
passport.use('local-signin',new LocalStrategy({
    usernameField:'email',
    passwordField: 'password',
    passReqToCallback:true
},(req,email,password,done)=>{
    userSchema.findOne({email:email},(err,result)=>{
        if(err){
            return done(err)
        }
        if(!result){
            return done(null,false,{message:`<p class="mx-md-4 bg-warning" style="padding: 1em 2em;display: flex;justify-content: flex-start;border-radius: 10px;width: max-content;">No such user! <a href="/register" style="font-weight: 900;">&#160;&#160;&#160; Register here</a></p>`})
        }
        if(!result.validPassword(password)){
            return done(null,false,{message:`<p class="mx-md-4 bg-warning" style="padding: 1em 2em;display: flex;justify-content: flex-start;border-radius: 10px;width: max-content;">Wrong Password!</p>`})
        }
        done(null,result)
    })
}))