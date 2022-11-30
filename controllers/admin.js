const { validationResult } = require('express-validator/check')
const mongoose = require('mongoose');

const Product = require('../models/product');

const get500Error = (err, next) => {
  const error = new Error(err);
  error.httpStatusCode = 500;
  return next(error);
}

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const product = new Product({
    _id: mongoose.Types.ObjectId('63795d371bea26a9b822a4a5'),
    title: title, 
    price: price, 
    description: description, 
    imageUrl: imageUrl, 
    userId: req.user
  });
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
      // return res.status(422).render('admin/edit-product', {
      //   pageTitle: 'Add Product',
      //   path: '/admin/add-product',
      //   editing: false,
      //   hasError: true,
      //   product: {
      //     title: title,
      //     price: price,
      //     imageUrl: imageUrl,
      //     description: description
      //   },
      //   errorMessage: 'Database operation falied. Please try again.',
      //   validationErrors: []
      // });
      // const error = new Error(err);
      // error.httpStatusCode = 500;
      // return next(error);
      return get500Error(err, next);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
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
      hasError: false,
      errorMessage: null,
      validationErrors: []
    });
  })
  .catch(err => {
    return get500Error(err, next);
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImgUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        imageUrl: updatedImgUrl,
        description: updatedDescription,
        _id: prodId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  
  Product.findById(prodId)
  .then(product => {
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/');
    }
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDescription;
    product.imageUrl = updatedImgUrl;
    return product.save().then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    });
  })
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

  Product.find({userId : req.user._id})
    // .select('title price imageUrl -_id')
    // .populate('userId', 'name')
    .then(products => {
      // console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
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
  Product.deleteOne({_id: prodId, userId: req.user._id})
  .then(() => {
    res.redirect('/admin/products');
  })
  .catch(err => {
    console.log(err);
  });
}

