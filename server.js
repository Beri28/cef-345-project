const express =require('express');
const app=express();
const dotenv=require('dotenv').config();
const router=require('./routes/routes')
const mongoose=require('mongoose');
const session=require('express-session');
//const passport=require('passport')
const userSchema=require('./model/user')
const loginRoute=require('./routes/login')
//const LocalStrategy=require('passport-local');
const MongoDBSession=require('connect-mongodb-session')(session)
const bcrypt=require('bcrypt')
const hbs=require('express-handlebars')
let cu='mongodb+srv://berinyuy28:berinyuy28.@cluster0.vb5vpsk.mongodb.net/dreamland'
mongoose.connect(cu).then(()=>{
    console.log("Successfully connected to db")
}).catch(()=>{
    console.log("Couldn't connect to db");
})
let mse="mongodb+srv://berinyuy28:berinyuy28.@cluster0.vb5vpsk.mongodb.net/dreamland"
const store=new MongoDBSession({
    uri:mse,
    collection:'sessions',
})

app.engine('hbs',hbs.engine({
    extname:'hbs',
    //defaultLayout:'default',
    partialsDir:__dirname+ "/views/partials/",
    layoutsDir:__dirname+ '/views/'
}))
app.set('view engine', 'hbs');
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded())
app.use(session({
    secret:'beri',
    resave:false,
    saveUninitialized:false,
    store:store,
}))


//checks if user has been authenticated
const isAuth=async(req,res,next)=>{
    if(req.session.isAuth){
        next()
    }
    else{
        res.redirect('./login.html')
    }
}



// app.post('/register',async (req,res)=>{
//     let userRes=await userSchema.findOne({email:req.body.email})
//     if(userRes){
//         res.redirect('./register.html')
//     }
//     else{
//         let newUser=new userSchema(req.body);
//         newUser.save().then(()=>{
//             // res.send("Register was succesful")
//             console.log("Register was succesful")
//             res.redirect('./login.html')
//         }).catch(()=>{
//             res.send("Couldn't save")
//         })
//     }
// })
// app.post('/login',async (req,res)=>{
//     console.log(req.body)
//     let oldUser=await userSchema.findOne({email:req.body.email});
//     if(!oldUser){
//         console.log("User with cred doesn't exist")
//         res.redirect('./register.html')
//     }else{
//         if(req.body.password==oldUser.password){
//             req.session.isAuth=true;
//             res.redirect('/dashboard')
//         }
//         else{
//             console.log("Wrong password")
//             res.redirect('./login.html')
//         }
//     }
// })
// app.get('/dashboard',isAuth,(req,res)=>{
//     res.send("Welcome")
// })

app.use('/',router)

app.listen(process.env.PORT,()=>{
    console.log("You just hit server");
})
