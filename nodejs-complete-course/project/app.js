const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const  mongoDbStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = "mongodb://surya:surya1234@ds121406.mlab.com:21406/shop"

const app = express();
const store = new mongoDbStore({
  uri: MONGODB_URI,
  collection:'sessions' 
});


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({ secret: 'my secret', 
  resave: false, 
  saveUninitialized: false,
  store:store 
})
);
app.use((req, res, next) => {
  User.findById('5c94b7071dfba403f0322e1a')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    MONGODB_URI,{ 
      useNewUrlParser: true 
    })
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Max',
          email: 'max@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(5000,()=>{
      console.log("server running on port 5000")
    });
  })
  .catch(err => {
    console.log(err);
  });
