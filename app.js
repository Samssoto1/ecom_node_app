const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000; // So we can run on heroku || (OR) localhost:5000

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('615d6062792c91fd2a8b1319')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
const corsOptions = {
    origin: "https://cse341ecomsite.herokuapp.com/",
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    family: 4
};

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://Samssoto:onmyhonor@ecomnodeapp.dznww.mongodb.net/test";

mongoose
  .connect(
    MONGODB_URL, options
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Sam',
          email: 'Sam@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });
