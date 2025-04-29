const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/userRoutes');
const furnitureRoutes = require('./routes/furnitureRoutes');

const app = express();



mongoose.connect('mongodb://127.0.0.1:27017/furnitureApp')
  .then(() => console.log('DB Connected'))
  .catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');


app.use(session({
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});


app.use('/', userRoutes);
app.use('/', furnitureRoutes);


app.listen(3000, () => {
  console.log('Server running on port 3000');
});
