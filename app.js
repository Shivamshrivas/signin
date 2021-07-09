//jshint esversion:6
//jshint esversion:6
require('dotenv').config();
const express=require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');
const session=require('express-session');
const passport=require('passport');
const passportLocalMongoose=require('passport-local-mongoose');
//const md5=require('md5');
//const bcrypt=require('bcrypt');
//const saltRounds=10;
const app=express();
//console.log(process.env.API_KEY);
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.use(session(
    {secret:"Our ittle Secrets.",
    resave:false,
    saveUninitialized:false
    }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});
mongoose.set("useCreateIndex",true);
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});


userSchema.plugin(passportLocalMongoose);

const User=new mongoose.model("User",userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.get("/",(req,res)=>
{res.render("Home");

});
app.get("/login",(req,res)=>
{res.render("Login");

});
app.get("/register",(req,res)=>
{res.render("Register");

});

//if user is already logged in
app.get("/secrets",(req,res)=>
{if(req.isAuthenticated()){res.render("secrets");}
else
{res.redirect("/login");}
    });

app.post("/register",(req,res)=>
{
    User.register({username:req.body.username},req.body.password,(err,user)=>
    {if(err){console.log(err);
    res.redirect("/register");}
else
{passport.authenticate("local")(req,res,()=>
{res.redirect("/secrets");})
} });
    /*bcrypt.hash(req.body.password,saltRounds,(err,hash)=>{
        const newUser=new User({
            email:req.body.username,
            password:hash
        });
        newUser.save((err)=>
        {if(!err)
            res.render("secrets");
        });
    });*/
    
});

app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});
app.post("/login",(req,res)=>
{
    const user=new User({
        username:req.body.username,
        password:req.body.password
    });
    req.login(user,(err)=>
    {if(err)
    {console.log(err);}
else
{passport.authenticate("local")(req,res,()=>
{res.redirect("/secrets");});
}
});
    
    
    
    
    
    /*const username=req.body.username;
const password=req.body.password;
User.findOne({email:username},(err,founduser)=>
{if(err){console.log(err);}
else
{if(founduser)
   {
      // if(founduser.password===password)
      bcrypt.compare(password,founduser.password,(req,result)=>
      { if(result===true)
        { res.render("secrets");
    }

   });
  
}
}
});*/


});


















app.listen(3000,()=>{
    console.log("Server Running on Port 3000");
});