const express =require('express');
const app=express();
const dotenv=require('dotenv').config();
const router=require('./routes/routes')
const mongoose=require('mongoose');
const session=require('express-session');
const passport=require('passport')
const userSchema=require('./model/user')
const LocalStrategy=require('passport-local');
const MongoDBSession=require('connect-mongodb-session')(session)
const MongoStore=require('connect-mongo')
const bcrypt=require('bcrypt')
const hbs=require('express-handlebars')
const multer=require('multer')
const path=require('path')
const fs=require('fs')
const mealSchema=require('./model/meal')
const flash=require('connect-flash');
const { escape } = require('querystring');
const nodemailer=require('nodemailer')
require('./config/passport')


let cu='mongodb+srv://berinyuy28:berinyuy28.@cluster0.vb5vpsk.mongodb.net/dreamland'
mongoose.connect(cu).then(()=>{
    console.log("Successfully connected to db")
}).catch(()=>{
    console.log("Couldn't connect to db");
})

// let mse="mongodb+srv://berinyuy28:berinyuy28.@cluster0.vb5vpsk.mongodb.net/dreamland"
// const store=new MongoDBSession({
//     uri:process.env.URI,
//     collection:'sessions',
// })

app.engine('hbs',hbs.engine({
    extname:'hbs',
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
    //store:store,
    store:MongoStore.create({mongoUrl:cu}),
    cookie:{maxAge:180*60*1000}
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use((req,res,next)=>{
    res.locals.login=req.isAuthenticated();
    res.locals.session=req.session;
    next()
})

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/assets/images')
    },
    filename:(req,file,cb)=>{
        cb(null,path.basename(file.originalname))
    }
})

const upload=multer({storage:storage})

//function to check if user is logged in and if user is restaurant manager , before saving new meal
const isAdmin=(req,res,next)=>{
    if(req.isAuthenticated() && (req.user.account_Type=='restaurant-manager')){
        return next()
    }else{
        if(!req.isAuthenticated()){
            res.redirect('/login')
        }
        else{
            res.send(`You aren't a restaurant manager <a href="/userAccount">home</a>`)
        }
    }
}

app.post('/add',isAdmin,upload.single('image'),async (req,res)=>{
    try {
                req.body.rating=parseInt(req.body.rating)
                req.body.rated_by=parseInt(req.body.rated_by)
                req.body.image=req.body.name.replace(/\s+/g,'') + path.extname(req.file.originalname)
                let oldImagePath= "public/assets/images/" + req.file.originalname;
                let newImageName=req.body.image//req.body.image + path.extname(req.file.originalname) 
                let newImagePath="public/assets/images/" + newImageName
                fs.rename(`${oldImagePath}`,`${newImagePath}`,(err)=>{
                    if(err){
                        throw(err)
                    }
                })
                let newMeal= new mealSchema(req.body);
                newMeal.save().then(()=>{
                    res.redirect('/userAccount')
                }).catch(()=>{
                    res.send("Couldn't save")
                })
    } catch (error) {
        console.log(error)
        res.send("error in adding new meal")
    }
})
app.use('/',router)

app.listen(process.env.PORT,()=>{
    console.log("You just hit server");
})
