///contains files for passport authentication

// Function below saves user id to a cookie
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((userSchema,done)=>{
    done(null,userSchema._id)
})

// Function below is used to retrieve user details from cookie
passport.deserializeUser(async (userId,done)=>{
    let user=await userSchema.findOne({_id:userId});
    done(null,user)
})


const findUser=new LocalStrategy(async (uname,password,done)=>{
    try {
        uname='victor';
        const user=await userSchema.findOne({name:uname})
        console.log(user)
        if(!user){
            console.log("No such user");
            return done(null,false)
        }
        else if(user.password!==password){
            console.log("Password incorrect");
            return done(null,false)
        }
        else{
            done(null,user)
        } 
    } catch (error) {
        return  console.log(error);
    }
})

passport.use(findUser)