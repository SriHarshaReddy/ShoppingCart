const Product = require('../models/products');

exports.getAddProduct = (req,res,next)=> {
    //res.sendFile(path.join(rootDir,'views','add-product.html'));
    res.render('admin/edit-product',{
        pageTitle:'Add product page'
        ,path: '/admin/add-product'
        ,editing:false
    });
}

exports.postAddProduct = (req,res,next)=> {
    //console.log(req.body.title);
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const description = req.body.description;
    const price = req.body.price;
    //const product = new Product(null, title, imageURL, description, price);
    req.user.createProduct({
        title:title,
        price:price,
        description:description,
        imageUrl:imageURL
    }).then((result) =>{
        console.log(result);
        res.redirect('/admin/products');
    }).catch(err =>{
        console.log(err);
    });
}

exports.getEditProduct = (req,res,next)=>{
    const editMode = req.query.edit;
    const productId = req.params.productId;
    if(!editMode)
    {
        res.redirect('/');
    }
    else
    {
        req.user.getProducts({id:productId})
        .then(product =>{
            if(!product)
            {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle:"Edit Product"
                ,path:"/admin/edit-product"
                ,editing:editMode
                ,product:product[0]
            }
            );
            
        }).catch(err =>{
            console.log(err);
        });
    }
}

exports.postEditProduct = (req,res,next)=>{
  const id = req.body.prodId;
  const title = req.body.title;
  const url = req.body.imageURL;
  const description = req.body.description;
  const price = req.body.price;
  Product.findByPk(id).then(prod =>{
      prod.title = title;
      prod.imageUrl = url;
      prod.description = description;
      prod.price = price;
      return prod.save();
  }).then(result =>{
      console.log("Updated Successfully");
      res.redirect('/admin/products');
  }).catch(err=>{
      console.log(err);
    });
  //const updatedProduct = new Product(id, title, url, description, price);
  //updatedProduct.save();
  
}


exports.getProducts = (req,res,next)=>{
    Product.findAll().then(products =>{ 
        res.render('admin/products',{
            prods:products
            , pageTitle:'Products'
            , path:'/admin/admin-product'});
        }).catch(err=>{
            console.log(err);
        });
    
}

exports.postDeleteProduct = (req,res,next) =>{
    const id = req.body.productId;
    Product.findByPk(id).then(product =>{
        product.destroy();
    }).catch(err=>{
        console.log(err);
    });
    res.redirect('/admin/products');

}
