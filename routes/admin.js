const { body } = require('express-validator');
const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

const isAdmin = require('../middleware/is-admin');
const isAuth = require('../middleware/is-auth');

router.use('/', isAuth);
router.use('/', isAdmin);

// GET => /admin
router.get('/', adminController.getAdmin);

// GET => /admin/products
router.get('/products', adminController.getProducts);

// POST => /admin/product
router.post(
    '/product',
    [
        body('title').isLength({ min: 1 }),
        body('link').isLength({ min: 1 }),
        body('price').isLength({ min: 1 }),
        body('description').isLength({ min: 1 })
    ],
    adminController.postAddProduct
);

// POST => /admin/product/delete
router.post('/product/delete', adminController.postDeleteProduct);

// POST => /admin/product/edit
router.post(
    '/product/edit',
    [
        body('title').isLength({ min: 1 }),
        body('link').isLength({ min: 1 }),
        body('price').isLength({ min: 1 }),
        body('description').isLength({ min: 1 })
    ],
    adminController.postEditProduct
);

// GET => /admin/product/edit?id=id
router.get('/product/edit', adminController.getEditProduct);

// GET => /admin/category
router.get('/categories', adminController.getCategories);

// POST => /admin/category/delete
router.post('/category/delete', adminController.postDeleteCategory);

// GET => /admin/category/edit?id=id
router.get('/category/edit', adminController.getEditCategory);

// POST => /admin/category/edit
router.post(
    '/category/edit',
    [
        body('title').isLength({ min: 1 }),
        body('link').isLength({ min: 1 }),
        body('description').isLength({ min: 1 })
    ],
    adminController.postEditCategory
);

// POST => /admin/category
router.post(
    '/category',
    [
        body('title').isLength({ min: 1 }),
        body('link').isLength({ min: 1 }),
        body('description').isLength({ min: 1 })
    ],
    adminController.postCategory
);

// GET => /admin/users
router.get('/users', adminController.getUsers);

// POST => /admin/users
router.post('/users', adminController.postUpdateUsers);

// GET => /admin/users/edit?id=id
router.get('/users/edit', adminController.getEditUsers);

// GET => /admin/comments
router.get('/comments', adminController.getComments);

// POST => /comments/delete
router.post('/comments/delete', adminController.postDeleteComment);

// POST => /admin/comment/status
router.post('/comment/status', adminController.postCommentStatus);

// GET => /admin/main-page
router.get('/main-page', adminController.getmainPage)

// POST => /admin/slider-image
router.post('/slider', adminController.postAddSliderImage);

// POST => /admin/slider/delete
router.post('/slider/delete', adminController.postDeleteSldierImage);

// POST => /admin/poster
router.post('/poster', adminController.postAddPoster)

// POST => /admin/poster/delete
router.post('/poster/delete', adminController.postDeletePosterImage)


module.exports = router;