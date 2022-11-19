const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({title: title, price: price, description: description, imageUrl: imageUrl, userId: req.user});
  // req.user.
  //   createProduct({
  //     title: title,
  //     price: price,
  //     imageUrl: imageUrl,
  //     description: description,
  // })
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product!');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err)
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  // Product.findById(prodId, product => {
  //   if (!product) {
  //     return res.redirect('/');
  //   }
  //   res.render('admin/edit-product', {
  //     pageTitle: 'Edit Product',
  //     path: '/admin/edit-product',
  //     editing: editMode,
  //     product: product
  //   });
  // });
  // Product.findById(prodId)
  //   // Product.findByPk(prodId)
  //   .then(product => {
  //     // const product = product;
  //     if (!product) {
  //       return res.redirect('/');
  //     }
  //     res.render('admin/edit-product', {
  //       pageTitle: 'Edit Product',
  //       path: '/admin/edit-product',
  //       editing: editMode,
  //       product: product
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });

    Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      // console.log(product);
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImgUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;

  Product.findById(prodId).then(product => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImgUrl;
    product.description = updatedDescription;
    return product
    .save()
  })
  .then(result => {
      console.log("UPDATED PRODUCT");
      res.redirect('/admin/products');
    })
  .catch(err => {
    console.log(err);
  });
};

exports.getProducts = (req, res, next) => {
  // req.user
  //   .getProducts()
  //   // Product.findAll()
  //   .then(products => {
  //     res.render('admin/products', {
  //       prods: products,
  //       pageTitle: 'Admin Products',
  //       path: '/admin/products'
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
  // Product.fetchAll(products => {
  //   res.render('admin/products', {
  //     prods: products,
  //     pageTitle: 'Admin Products',
  //     path: '/admin/products'
  //   });
  // });

  Product.find()
    // .select('title price imageUrl -_id')
    // .populate('userId', 'name')
    .then(products => {
      // console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.session.isLoggedIn
      });
    }).catch(err => {
      console.log(err);
    });
};

// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   // console.log('Form admin controller: ', prodId);
//   // Product.destroy( { WHERE: { id: prodId }});
//   Product.findByPk(prodId)
//   .then(product => {
//     return product.destroy();
//   })
//   .then(result => {
//     console.log('PRODUCT DESTROYED');
//     res.redirect('/admin/products');
//   })
//   .catch(err => {
//     console.log(err);
//   })
//   // Product.deleteById(prodId);
// }
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
  .then(() => {
    res.redirect('/admin/products');
  })
  .catch(err => {
    console.log(err);
  });
}

