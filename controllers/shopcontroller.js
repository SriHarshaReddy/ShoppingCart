const Product = require('../models/products');
const Cart = require('../models/cart');

exports.getShop = (req,res,next)=> {
    //console.log(appData.products);
    /*res.sendFile(path.join(rootDir,'views','shops.html'));*/
    req.user.getProducts().then((products)=>{
        res.render('shop/products-list',{
            prods:products
            , pageTitle:'Shop'
            , path:'/products'});

    }).catch((err) =>{console.log(err);});
   
}

exports.getProduct = (req,res,next)=>{
    const productId = req.params.productId;
    Product.findByPk(productId).then((product)=>{
        
        res.render('shop/product-detail',{product:product
            , pageTitle:product.title
            , path:"/products"
            });
    }).catch(err=>{console.log(err)});
    
    
}
exports.getIndex= (req,res,next) =>{
    res.render('shop/index',{pageTitle:'Shop index', path:'/'});
}
exports.getCart = (req,res,next)=>{
    req.user
        .getCart()
            .then(cart=>{
                    return cart
                        .getProducts();
            })
            .then(products =>{
                res.render('shop/cart',
                    {pageTitle:'Cart',
                    path:'/cart', 
                    products:products
                });
            })
            .catch(err =>{console.log(err)});
}

exports.postCart = (req,res,next) =>{
    const prodId = req.body.productId;
    //console.log(productId);
    let fetchedCart;
    let newQuantity = 1;
    req.user
        .getCart()
            .then(cart =>{
                fetchedCart = cart;
                return cart.getProducts({where:{id : prodId}});
            })
            .then(products =>{
                let product;
                if(products.length>0)
                {
                    product = products[0];
                }
              
                if(product)
                {
                    const oldQuantity = product.cartitem.quantity;
                    newQuantity = oldQuantity+1;
                }
                return Product.findByPk(prodId);
            })
            .then(product =>{
                return fetchedCart.addProduct(product , {through : {quantity: newQuantity}});
            })
            .catch(err=>console.log(err));
   /*
    Product.findById(prodId, product =>{
        Cart.addProduct(prodId, product.price);
    });
    */
    res.redirect('/');
   
}

exports.postDeleteCart = (req,res,next)=>{
    const prodId = req.body.productId;
    req.user.getCart().then(cart =>{
        return cart.getProducts({where:{id:prodId}});
    })
    .then(products =>{
        let product;
        product = products[0];
        return product.cartitem.destroy();
    })
    .then(result =>{
        res.redirect('/cart');
    })
    .catch(err =>  console.log(err));
}

exports.getOrders = (req,res,next)=>{
    req.user.getOrders({include: ['products']})
        .then(orders => {
                res.render('shop/orders',{
                pageTitle:'Orders',
                path:'/orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
}

exports.postOrder = (req,res,next)=>{
    let fetchedCart;
    req.user
        .getCart()
        .then( cart =>{
            fetchedCart = cart;
            return cart.getProducts()
        })
        .then(
            products =>{
               return req.user.createOrder()
                            .then(order => order.addProducts(
                                products.map( product =>{
                                    product.orderitem = {quantity: product.cartitem.quantity }
                                    return product;
                                })
                            )).catch(err=>console.log(err));
            }
        )
        .then(result =>{
            return fetchedCart.setProducts(null);
        })
        .then(result =>{
            res.redirect('/orders');
        })
        .catch(err=> console.log(err));    
}