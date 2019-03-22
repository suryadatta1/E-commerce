const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const port = process.env.port||5000;

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('"5c94b36875f5be02759e29da')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.Promise = global.Promise;

//connecting to mongoose

mongoose.connect('mongodb://surya:surya1234@ds121406.mlab.com:21406/shop', {
    useNewUrlParser: true 
})
  .then(result => {
    User.findOne()
    .then(user => {
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
     console.log("mlab connected");
    });
    
    app.listen(5000,()=>{
      console.log(`server running on port ${port}`);
    })
  })
  .catch(err => {
    console.log(err);
  });
