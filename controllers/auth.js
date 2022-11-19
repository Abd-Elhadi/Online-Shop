const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10')
    // req.session.isLoggedIn = true;
    User.findById("63754fee7d611148776f043f")
        .then(user => {
            // console.log(user.cart.items);
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
};