const express = require("express");
const path = require("path");
const collection = require("./config");
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

// convert data into JSON format
app.use(express.json());

// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

// Use EJS as the view engine
app.set("view engine", "ejs");

// Use sessions for user authentication
app.use(session({
    secret: 'your-secret-key', // Change this to a secure secret key
    resave: false,
    saveUninitialized: true
}));

// Initialize Passport and session middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Configure Passport
require('./passport-config')(passport);

// Define the isLoggedIn middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // If the user is authenticated, store user info in res.locals
        res.locals.user = req.user;
        next();
    } else {
        res.locals.user = null;
        next();
    }
}

// Routes

app.get("/", isLoggedIn, (req, res) => {
    res.render("index", { user: res.locals.user });
});

app.get("/terms", (req, res) => {
    res.render("terms");
});

app.get("/refunds", (req, res) => {
    res.render("refunds");
});

app.get("/booking", (req, res) => {
    res.render("booking");
});

app.get("/privacy", (req, res) => {
    res.render("privacy");
});

app.get("/cancellation", (req, res) => {
    res.render("cancellation");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password,
        phone_number: req.body.phone_number,
        firstname: req.body.firstname
    }

    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        // User already exists, redirect to signup page with a flash message
        req.flash('error', 'User already exists. Please choose a different username.');
        res.redirect("/signup");
    } else {
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; // Replace the original password with the hashed one

        // Create a new user document
        const newUser = new collection(data);
        await newUser.save();
        
        // Redirect to the login page
        res.redirect("/login");
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

// Login user 
app.post("/login", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
}));


//logout user
app.get("/logout", (req, res) => {
    req.logout(); // Passport function to log out the user
    res.redirect("/login"); // Redirect to the login page after logging out
});



// Define Port for Application
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
