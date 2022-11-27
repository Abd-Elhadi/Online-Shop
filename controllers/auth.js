const crypto = require('crypto');

const bcrypt = require('bcryptjs');

const User = require('../models/user');

const aws = require('aws-sdk');
const { validationResult } = require('express-validator/check')

const ses = new aws.SES({region: "us-east-1"});

function sesTest(emailTo, emailFrom, subject, message) {
    let params = {
        Destination: {
          /* required */
          ToAddresses: [emailTo]
        },
        Message: {
          /* required */
          Body: {
            /* required */
            Html: {
              Charset: "UTF-8",
              Data: message
            }
            // ,
            // Text: {
            //   Charset: "UTF-8",
            //   Data: `Hi  $\{name\}!Your Login OTP is $\{otp\}`
            // }
          },
          Subject: {
            Charset: 'UTF-8',
            Data: subject
          }
        },
        Source: emailFrom,
        /* required */
        ReplyToAddresses: [emailFrom]
    };
    return ses.sendEmail(params).promise();
};


exports.getLogin = (req, res, next) => {
    // console.log(req.flash('error'));
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        oldInput: {
            email: "",
            password: "",
        },
        validationErrors: []
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
        oldInput: {
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationErrors: []
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email, 
                password: password
            },
            validationErrors: errors.array()
        });
    }

    User.findOne({email: email})
    .then(user => {
        if(!user) {
            // req.flash('error', 'Invalid email or password.')
            return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: 'Invalid email or password.',
                oldInput: {
                    email: email, 
                    password: password
                },
                validationErrors: []
            });
        }
        bcrypt.compare(password, user.password)
        .then(doMatch => {
            if (doMatch) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                    if (err) console.log(err);
                    res.redirect('/');
                });
            }
            // req.flash('error', 'Invalid email or password.')
            return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: 'Invalid email or password.',
                oldInput: {
                    email: email, 
                    password: password
                },
                validationErrors: []
            });
        })
        .catch(err => {
            console.log(err);
            res.redirect('/login')
        })
    })
    .catch(err => {
        console.log(err);
    })
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email, 
                password: password, 
                confirmPassword: req.body.confirmPassword
            },
            validationErrors: errors.array()
        });
    }
    bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
        const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
        });
        return user.save();    
    })
    .then(result => {
        const emailTo = email;
        const emailFrom = "abdelhadiomar.coder@hotmail.com";
        const message = `<p>You successfully signed up!</p>
                        <br>
                        <p>Regards,<br/>
                        Abdelhadi</p>`;
        const subject = 'Successful signup!';
        
        res.redirect('login');
        sesTest(emailTo, emailFrom, subject, message)
    })

};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        // console.log(token);
        User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                req.flash('error', 'No account with that email found.');
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        })
        .then(result => {
            const emailFrom = 'abdelhadiomar.coder@hotmail.com';
            const emailTo = req.body.email;
            const subject = 'Password reset';
            const message = `
                            <p>You requested a password reset.</p>
                            <p>Click this <a href ="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
                            <p>Regards,<br/>
                            Abdelhadi</p>`;
            res.redirect('/');
            sesTest(emailTo, emailFrom, subject, message);
        })
        // .then(val => {
        //     console.log('got this back', val)
        //     console.log('Successful');
        //     res.redirect('/');
        // })
        .catch(err => {
            console.log(err);
        })
    })
};

exports.getNewPassword = (req, res, next) => {
    // console.log('hello');
    const token = req.params.token;
    // console.log(token);
    User.findOne({resetToken : token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user => {
        let message = req.flash('error');
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }
        res.render('auth/new-password', {
            path: '/new-password',
            pageTitle: 'New Password',
            errorMessage: message,
            userId: user._id.toString(),
            passwordToken: token
        });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({ 
        resetToken: passwordToken, 
        resetTokenExpiration: {$gt: Date.now()}, 
        _id: userId
    })
    .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    })
    .then(result => {
        res.redirect('/login');
    })
    .catch(err => {
        console.log(err);
    });
};
