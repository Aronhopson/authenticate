var express                = require("express"),
    mongoose               = require("mongoose"),
    bodyParser             = require("body-parser"),
    passport               = require("passport"),
    User                   = require("./models/user"),
    LocalStrategy          = require("passport-local"),
    passportLocalMongoose  = require("passport-local-mongoose")

mongoose.connect("/mongodb://localhost:27017/athen_app", {useNewUrlParser:true});


var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
//encoding and deconding secret
app.use(require("express-session")({
    secret : "Amagizing performance",
    resave : false,
    saveUninitialized : false 
 }));
//setting up so that passpsort will work in app
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//they are responsible for reading session,  {enconding it and putting back to session(serilized)}
passport.serializeUser(User.serializeUser());
//takES data from session thats encoded and un encoding it(deserialsized)
passport.deserializeUser(User.deserializeUser());

//===============================
//ROUTES
//================================
//home
app.get("/", function(req, res){
    res.render("home");
});

//SECRET LOCATION
app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});

//SIGN UP ROUTES
app.get("/register", function(req, res){
    res.render("register");
});

//Post handling for user sign up
app.post("/register", function(req, res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });
});

//LOGIN  ROUTS
//render login
app.get("/login", function(req, res){
    res.render("login");
});
//login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){

});

app.get("/logout", function(req, res){
    req.logOut();
    res.redirect("/");
});
//MIDDLE WARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000, function( ){
    console.log("Server has begin");
});