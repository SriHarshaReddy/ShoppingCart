const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./util/database');

const app = express();

const adminRoutes = require('./routes/admin');
const shoproute = require('./routes/shop');

const Product = require('./models/products');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');;
const OrderItem = require('./models/order-item')

const errorController = require('./controllers/404Controller');
const { getProducts } = require('./controllers/admincontroller');
const { userInfo } = require('os');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"public")));

app.set('view engine','ejs');
app.set('views','views');

app.use((req,res,next)=>{
    User.findByPk(1).then(user=>{
        req.user = user;
        next();
    }).catch(err=>{
        console.log(err);
    });
});

app.use('/admin',adminRoutes);
app.use(shoproute);

app.use(errorController.pageNotFound);



Product.belongsTo(User, {constraints:true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product , {through: OrderItem});

Cart.belongsToMany(Product, {through : CartItem});
Product.belongsToMany(Cart, {through : CartItem});


sequelize
//.sync({force:true})
.sync()
.then((result)=>{
    //console.log(result);
    return User.findByPk(1);
})
.then(user =>{
    if(!user)
    {
      return  User.create({userName:"Harsha",emailId:"harshareddy.sri@gmail.com"});
    }
    return user;
})
.then(user =>{
    return user.createCart();
})
.then(cart =>{
    console.log("User Created or Extracted successfully");
    app.listen(3000);
})
.catch((err)=>{
    console.log(err);
});



