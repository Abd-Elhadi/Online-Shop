module.exports =(req, res, next) => {
    if (!req.session.isLoggedIn) {
        // console.log('You need to be loggedin first');
        return res.redirect('login');
    }
    next();
};