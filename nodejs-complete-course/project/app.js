const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
//const User = require('./models/user');

const app = express();
const port = process.env.port||5000;

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://surya:surya1234@ds121406.mlab.com:21406/shop', {
    useNewUrlParser: true 
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   User.findById('5c939dfb53e54844b07d7625')
//     .then(user => {
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       next();
//     })
//     .catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


  app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
  });

