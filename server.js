const express =require('express');
const app =express();
const path=require("path");
const { connectMongoose ,User }=require("./models/database.js");
const passport = require('passport');
const {intializingPassport}=require("./passportconfig.js");
const expressSession =require("express-session");

connectMongoose();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({secret:"hello",resave:false,saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());


intializingPassport(passport);

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

isAuthenticated=(req, res, next) =>{
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).redirect('/');
}

app.get("/",(req,res)=>{
    res.render("index.ejs")
})

app.get("/Educator",(req,res)=>{
    let role = req.path.split('/')[1]; 
    console.log(role);
    res.render("authorization.ejs",{role});
})

app.get("/Student",(req,res)=>{
    let role = req.path.split('/')[1]; 
    console.log(role);
    res.render("authorization.ejs",{role});
})

app.get('/login',(req, res) => {
    res.render('login.ejs');
});

app.post('/login', 
    passport.authenticate('local',{
      failureRedirect: "/login",
    }),
    async(req,res)=>{
        const user =await User.findOne({username:req.body.username});
        console.log(" req = ",req.body);
        console.log(" user = ",user);
        if(user.role==req.body.role){
            if(user.role=="Educator"){
                res.render("admin_access.ejs",{user});
            }
            else{
                res.render("Student_access.ejs",{user});
            }
        }
        else{
            res.render("login.ejs");
        }
    } 
  );

// app.get('/admin_access',isAuthenticated(),async(req,res)=>{
//     res.render("admin_access.ejs",{user});    for a particular id
// })

app.post("/signup",async(req,res)=>{
    const check_user =await User.findOne({username:req.body.username});
    if(check_user) return res.status(400).send("User already exists");
    console.log("user created succesfully",req.body);

    const user = new User(req.body);
    await user.save();
    res.render("admin_access.ejs",{user})
})

app.listen(3000,()=>{
    console.log("server started successfully");
})
