const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById("615dad63108295df10e44eed")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// mongoConnect(() => { //while using mongodb alone without mongoose
//   app.listen(3000);
// });

mongoose.connect(
  'mongodb://MongoDB_User:MongoDBUser%40210791@node-complete-shard-00-00.0vl9o.mongodb.net:27017,node-complete-shard-00-01.0vl9o.mongodb.net:27017,node-complete-shard-00-02.0vl9o.mongodb.net:27017/shop?ssl=true&replicaSet=atlas-13wbgl-shard-0&authSource=admin&retryWrites=true&w=majority'
)
.then(() => {
  console.log('Connected!');
  User.findOne() //it will send the first user it finds as no condition specified
    .then(user => {
      if(!user){
        const user = new User({
          name: "testUser",
          email: "testemail@test.com",
          cart: { items: [] }
        });

        user.save(); //it will create user in db
      }
    });
  app.listen(3000);
})
.catch(err => console.log(err));