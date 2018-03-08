require('dotenv').config();

// Getting Importes Modules

var express = require('express');
    cors = require('cors');
    bodyParser = require('body-parser');
    ejs = require('ejs');
    mongoose = require('mongoose');
    morgan = require('morgan');
    passport = require('passport');
    path = require('path');
    session = require('express-session')
    app = express();
    flash = require('connect-flash');

// setting port

var port = process.env.PORT || 3000;

// connecting database

mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on('connected',()=>{
  console.log("Successfully connected to database");
});
mongoose.connection.on('error',(err)=>{
  console.log(err);
});


// getting files

var user = require('./routes/user');

// Setting views

app.set('views', path.join(__dirname , "views"));
app.set("view engine","ejs");

// Using modules
app.use(flash());
app.use(morgan('dev'));
app.use(cors());
app.use(session({
  secret: process.env.SECRET,
  resave: true,
	saveUnitialized: true
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
require('./config/passport')(passport);
// Start === Getting router and setting them

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.infos = req.flash("info");
  res.locals.errors = req.flash("error");
  next();
});

app.use('/',user);

// starting server
app.listen(port,()=>{
  console.log('Server started at port : ' + port);
});
