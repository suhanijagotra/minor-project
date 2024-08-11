const express = require('express');
const app = express();
const path = require("path");
const { connectMongoose, User } = require("./models/database.js");
const passport = require('passport');
const { intializingPassport } = require("./passportconfig.js");
const expressSession = require("express-session");

connectMongoose();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({ secret: "hello", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

intializingPassport(passport);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).redirect('/');
};

// Home page route
app.get("/", (req, res) => {
    res.render("index.ejs");
});

// Separate login routes for students and teachers
app.get("/login-student", (req, res) => {
    res.render("login/login-student.ejs");
});

app.get("/login-teacher", (req, res) => {
    res.render("login/login-teacher.ejs");
});

// Separate signup routes for students and teachers
app.get("/signup-student", (req, res) => {
    res.render("login/student-signup.ejs");
});

app.get("/signup-teacher", (req, res) => {
    res.render("login/teacher-signup.ejs");
});

// Login handling with role-based redirection
app.post('/login', 
    passport.authenticate('local', {
        failureRedirect: "/login",
    }),
    async (req, res) => {
        const user = await User.findOne({ username: req.body.username });
        console.log(" req = ", req.body);
        console.log(" user = ", user);

        if (user && user.role === req.body.role) {
            if (user.role === "Educator") {
                res.render("login/login-teacher.ejs", { user });
            } else {
                res.render("login/login-student.ejs", { user });
            }
        } else {
            res.render("authorization.ejs", { role: req.body.role });
        }
    }
);

// Signup handling with role-based redirection
app.post("/signup", async (req, res) => {
    const check_user = await User.findOne({ username: req.body.username });
    if (check_user) return res.status(400).send("User already exists");
    console.log("user created successfully", req.body);

    const user = new User(req.body);
    await user.save();

    if (user.role === "Educator") {
        res.render("login/login-teacher.ejs", { user });
    } else {
        res.render("login/login-student.ejs", { user });
    }
});

app.listen(3000, () => {
    console.log("server started successfully");
});
