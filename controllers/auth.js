const { validationResult } = require('express-validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = async (req, res, next) => {
    try {
        const user = req.user;
        // if user already logged In
        if (user) {
            return res.redirect('/');
        }
        res.status(200).render('auth/login', {
            errorMessages: req.flash('errorMessages'),
            path: '/auth/signup',
            user: req.user,
            oldInput: { email: '', password: '' },
            errors: [],
            title: 'ورود به حساب'
        });
    } catch (error) {
        console.log(error);
    }
};

exports.postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // express- validator
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).render('auth/login', {
                errorMessages: ['یک ایمیل صحیح وارد کنید'],
                path: '/auth/signup',
                user: req.user,
                oldInput: { email, password },
                errors: errors.array(),
                title: 'ورود به حساب'
            });
        }

        const user = await User.findOne({ where: { email: email } });
        // if user not found
        if (!user) {
            return res.status(400).render('auth/login', {
                errorMessages: ['کاربری با این ایمیل یافت نشد'],
                path: '/auth/signup',
                user: req.user,
                oldInput: { email, password },
                errors: [{ param: 'password' }],
                title: 'ورود به حساب'
            });
            return;
        }

        const isPasswword = await bcrypt.compare(password, user.password);
        if (isPasswword) {
            // session
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((error) => {
                console.log(error);
                res.redirect('/');
            });
        } else {
            // password is not match
            req.flash('errorMessages', ['پسورد نادرست است']);
            req.session.save((err) => {
                console.log(err);
                return res.status(400).render('auth/login', {
                    errorMessages: req.flash('errorMessages'),
                    path: '/auth/signup',
                    user: req.user,
                    oldInput: { email, password },
                    errors: [{ param: 'password' }],
                    title: 'ورود به حساب'
                });
            });
        }
    } catch (error) {
        console.log(error);
    }
};

exports.getSignup = async (req, res, next) => {
    res.status(200).render('auth/signup', {
        path: '/auth/signup',
        user: req.user,
        errorMessages: req.flash('errorMessages'),
        oldInput: { name: '', email: '', password: '', confirmPassword: '' },
        errors: [],
        title: 'ساخت حساب'
    });
};

exports.postSignup = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // express validator
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render('auth/signup', {
                path: '/auth/signup',
                user: req.user,
                oldInput: { name, email, password, confirmPassword },
                errorMessages: ['لطفا یک ایمیل وارد کنید'],
                errors,
                title: 'ساخت حساب'
            });
        }

        //  if user already exist
        const userDoc = await User.findOne({ where: { email: email } });
        if (userDoc) {
            return res.status(422).render('auth/signup', {
                path: '/auth/signup',
                user: req.user,
                oldInput: { name, email, password, confirmPassword },
                errorMessages: ['کاربردی با این ایمیل ثبت شده است'],
                errors: [{ param: 'email' }],
                title: 'ساخت حساب'
            });
        }

        if (password !== confirmPassword) {
            return res.status(422).render('auth/signup', {
                path: '/auth/signup',
                user: req.user,
                oldInput: { name, email, password, confirmPassword },
                errorMessages: ['باید رمز عبورها یکسان باشید'],
                errors: [{ param: 'confirmPassword' }],
                title: 'ساخت حساب'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            accessLevelId: 1
        });

        const cart = await user.createCart();
        res.redirect('/auth/login');
    } catch (error) {
        console.log(error);
    }
};

exports.getResetPassword = async (req, res, next) => {
    try {
        res.status(200).render('auth/reset', {
            errorMessages: req.flash('errorMessages'),
            path: '/auth/reset',
            user: req.user,
            title: 'فراموشی رمز'
        });
    } catch (error) {
        console.log(error);
    }
};

exports.postResetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email: email } });
        // if user not found = user not log in
        if (!user) {
            req.flash('errorMessages', ['کاربری با این ایمیل یافت نشد']);
            req.session.save((err) => {
                console.log(err);
                return res.redirect('/auth/reset');
            });
        }
        // crypto
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                // log error
                console.log(err);
                req.flash('errorMessages', ['دوباره تلاش کنید.']);
                req.session.save((err) => {
                    console.log(err);
                    return res.redirect('/auth/reset');
                });
            }
            // generate token
            const token = buffer.toString('hex');
            // set token and time
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            await user.save();

            req.flash('errorMessages', ['ایمیل ارسال شد.']);
            req.session.save((err) => {
                console.log(err);
                return res.redirect('/auth/reset');
            });
        }); // end crypto
    } catch (error) {
        console.log(error);
    }
};

exports.getNewPassword = async (req, res, next) => {
    try {
        const { resetToken } = req.params;
        // user with that token
        const user = await User.findOne({ where: { resetToken: resetToken } });
        // if user not found
        if (!user) {
            req.flash('errorMessages', ['کاربری با این توکن یافت نشد']);
            req.session.save((err) => {
                console.log(err);
                return res.redirect('/auth/login');
            });
            return;
        }

        res.render('auth/new-password', {
            user,
            path: 'auth/reset',
            title: 'رمز جدید'
        });
    } catch (error) {
        console.log(error);
    }
};

exports.postNewPassword = async (req, res, next) => {
    try {
        const { userId, password, confirmPassword } = req.body;
        const user = await User.findByPk(userId);

        if (
            password == confirmPassword &&
            user.resetTokenExpiration > Date.now()
        ) {
            const newPassword = await bcrypt.hash(password, 12);
            user.password = newPassword;
            user.resetToken = null;
            await user.save();
        }

        res.redirect('/auth/login');
    } catch (error) {
        console.log(error);
    }
};

exports.postLogout = async (req, res, next) => {
    req.session.destroy((error) => {
        console.log(error);
        res.redirect('/');
    });
};
