const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const MONGODB_URI = "mongodb://new-admin:admin12345@ac-p7kh1b4-shard-00-00.5kdpvq0.mongodb.net:27017,ac-p7kh1b4-shard-00-01.5kdpvq0.mongodb.net:27017,ac-p7kh1b4-shard-00-02.5kdpvq0.mongodb.net:27017/shop?ssl=true&replicaSet=atlas-u5ux7l-shard-0&authSource=admin&retryWrites=true&w=majority";

// const sequelize = require('./util/database');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
// const { use } = require('./routes/admin');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'my secret', 
    resave: false, 
    saveUninitialized: false, 
    store: store
}));

app.use((req, res, next) => {
    if (!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
    .connect(MONGODB_URI)
    // .connect('mongodb+srv://new-admin:admin12345@cluster0.5kdpvq0.mongodb.net/?retryWrites=true&w=majority')
    .then(result => {
        // console.log(result);
        console.log('Connected');
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Abdelhadi',
                    email: 'hadi@test.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

// mongoConnect(() => {
//     // console.log('Connected');
//     // console.log(client);
//     app.listen(3000);
// });

// Product.belongsTo(User, { constraints : true, onDelete : 'CASCADE' });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through : CartItem });
// Product.belongsToMany(Cart, { through : CartItem });
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through : OrderItem });


// sequelize.sync
//     // ({ force : true })
//     ()
//     .then(result => {
//         return User.findByPk(1);
//         // console.log(result);
        
//     })
//     .then(user => {
//         if (!user){
//             return User.create({ name : 'Hadi', email : 'test@test.com'});
//         }
//         return user;
        
//     })
//     .then(user => {
//         // console.log(user);
//         return user.createCart();
//     })
//     .then(cart => {
//         app.listen(3000);
//     })
//     .catch(err => {
//         console.log(err);
//     });
