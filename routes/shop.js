const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');




const isAuth = require('../middleware/is-auth');

// GET => /
router.get('/', shopController.getIndex);

// GET => /shop
router.get('/shop', shopController.getShop);

// GET => /product/:productId
router.get('/product/:productId', shopController.getProduct);

// POST => /comment
router.post('/comment', shopController.postAddComment)

// POST => /comment/edit
router.post('/comment/edit/', shopController.postGetEditComment)

// POST => /cooment/edit/post
router.post('/comment/:commentId', shopController.postPostEditComment)

// GET => /cart
router.get('/cart', isAuth, shopController.getCart);

// GET => /profile
router.get('/profile', isAuth, shopController.getProfile)

// POST => /profile/edit ==> GET EDIT PROFILE PAGE
router.post('/profile/edit', isAuth, shopController.postGetEditProfile)

// POST => /profile/  ==> EDIT PROFILE
router.post('/profile', isAuth, shopController.postPostEditProfile)

// POST => /profile/avatar
router.post('/profile/avatar', isAuth, shopController.postProfileAvatar)

// POST => /cart
router.post('/cart', isAuth , shopController.postCart);

router.post('/cart/delete', isAuth, shopController.postDeleteCart)

// GET => /order
router.get('/order', isAuth, shopController.getOrder);

// POST => /order
router.post('/order', isAuth, shopController.postOrder);

// GET => /order
router.get('/order/:orderId', isAuth, shopController.getInvoice);


router.get('/hello', (req,res) => {
    res.json({u: req.session});
})


module.exports = router;
