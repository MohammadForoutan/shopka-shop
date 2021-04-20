const { body } = require('express-validator');
const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

router.use('/', isAdmin);
router.use('/', isAuth);

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
router.get('/main-page', adminController.getMainPage);

// POST => /admin/main-page
router.post('/main-page', adminController.postAddMainPageView);

// POST => /admin/main-page/delete
router.post('/main-page/delete', adminController.postDeleteMainPageView);

// GET => /admin/main-page/edit?viewId=view.id
router.get('/main-page/edit', adminController.getEditMainPageView);

// POST => /admin/main-page/edit
router.post('/main-page/edit', adminController.postEditMainPageView);

// POST => /admin/main-page-type
router.post('/main-page-type', adminController.postAddMainPageType);

// POST => /admin/main-page-type/delete
router.post('/main-page-type/delete', adminController.postDeleteMainPageType);

module.exports = router;
