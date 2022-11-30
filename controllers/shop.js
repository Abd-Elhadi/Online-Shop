const Product = require('../models/product');
const Order = require('../models/order');
const user = require('../models/user');

const get500Error = (err, next) => {
  const error = new Error(err);
  error.httpStatusCode = 500;
  return next(error);
}

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      // console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    }).catch(err => {
      return get500Error(err, next);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  const token = req.params.token;
  // Product.findAll({ where: { id : prodId} }).then(products => {
  //   console.log(products[0]);
  //   res.render('shop/product-detail', {
  //     product: products[0],
  //     pageTitle: products[0].title,
  //     path: '/products'
  //   })
  // }).catch(err => {
  //   console.log(err);
  // });
  Product.findById(prodId)
    .then(product => {
      // console.log(product);
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      })
    })
    .catch(err => {
      return get500Error(err, next);
    });
}

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      // console.log('here')
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    }).catch(err => {
      return get500Error(err, next);
    });
};

exports.getCart = (req, res, next) => {
  // console.log(req.user);
  // console.log(req.user.cart);
  req.user
  .populate('cart.items.prodId')
    .then(user => {
      const products = user.cart.items;
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: products
        });
    })
    .catch(err => {
      return get500Error(err, next);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
  .then(product => {
    return req.user.addToCart(product);
  })
  .then(result => {
    // console.log('You?')
    // console.log(result);
    res.redirect('/cart');
  })
  .catch(err => {
    return get500Error(err, next);
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
      .then(result => {
        res.redirect('/cart');
      })
      .catch(err => {
        return get500Error(err, next);
      });
  // Product.findByPk(prodId, product => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect('/cart');
  // });
};

exports.postOrder = (req, res, next) => {
  req.user
  .populate('cart.items.prodId')
    .then(user => {
      // console.log(user.cart.items);
      const products = user.cart.items.map(i => {
        return {
          quantity: i.quantity,
          product: {...i.prodId._doc}
        };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
        return req.user.clearCart();
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => {
      return get500Error(err, next);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
  .then(orders => {
    // console.log(orders);
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
  .catch(err => {
    return get500Error(err, next);
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};