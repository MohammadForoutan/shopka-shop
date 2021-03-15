const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const {body} = require('express-validator');



// GET => /auth/login
router.get('/login',  authController.getLogin);

// POST => /auth/login
router.post('/login',  [
    body('email').isEmail()
] ,authController.postLogin)

// GET => /auth/signup
router.get('/signup',  authController.getSignup);

// POST => /auth/signup
router.post('/signup',[
    body('email').isEmail()
],authController.postSignup);

// GET => /auth/reset
router.get('/reset', authController.getResetPassword)

// GET => /auth/reset/:resetToken
router.get('/reset/:resetToken', authController.getNewPassword);

// GET => /reset/newPassword
router.post('/reset/newPassword', authController.postNewPassword)

// POST => /auth/reset
router.post('/reset', authController.postResetPassword)

router.post('/logout', authController.postLogout)


module.exports = router