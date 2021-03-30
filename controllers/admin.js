const AccessLevel = require('../models/access-level');
const Category = require('../models/category');
const Product = require('../models/product');
const User = require('../models/user');
const Comment = require('../models/comment');
const MainPage = require('../models/main-page');
const MainPageType = require('../models/main-page-type');

// util
const { validationResult } = require('express-validator');
const { deleteFile } = require('../util/file');
const { flashError } = require('../util/error');

const ALL_CATEGORY_ID = 1;
const UNCATEGORIZED_CATEGORY_ID = 2;
const ADMIN_USER_ID = 1;

exports.getAdmin = (req, res, next) => {
    try {
        res.status(200).render('admin/dashboard', {
            path: '/admin',
            title: 'داشبورد'
        });
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const editMode = false;

        const products = await Product.findAll({ include: Category });
        const categories = await Category.findAll();
        res.status(200).render('admin/products', {
            path: '/admin/products',
            title: 'محصولات',
            errorMessages: req.flash('errorMessages'),
            editMode,
            errors: [], // in error needed
            oldInput: {
                // in error needed
                title: '',
                price: '',
                description: '',
                link: '',
                categoryId: '',
                attributes: ''
            },
            product: {}, // in editMode needed
            products,
            categories
        });
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postAddProduct = async (req, res, next) => {
    try {
        let image = req.file;
        if (!image) {
            // no image
            image = '';
        }

        const {
            title,
            price,
            description,
            link,
            categoryId,
            attributes
        } = req.body;

        // express validator
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const editMode = false;
            const products = await Product.findAll({ include: Category });
            const categories = await Category.findAll();
            return res.status(400).render('admin/products', {
                path: '/admin/products',
                title: 'محصولات',
                editMode,
                errors: errors.array(),
                errorMessages: ['لطفا این فیلد ها را با مقدار مناسب پر کنید'],
                oldInput: {
                    title,
                    price,
                    description,
                    link,
                    categoryId,
                    attributes
                },
                products,
                categories
            });
        }

        const product = await Product.create({
            title,
            price,
            description,
            categoryId,
            link,
            image: image.path,
            attributes
        });
        res.redirect('/admin/products');
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postDeleteProduct = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const product = await Product.findByPk(productId);
        if (product.image) {
            deleteFile(product.image);
        }
        await product.destroy();
        res.redirect('/admin/products');
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getEditProduct = async (req, res, next) => {
    try {
        const productId = req.query.id;
        const product = await Product.findByPk(productId, {
            include: {
                model: Category
            }
        });
        // find all categories
        const categories = await Category.findAll();

        res.status(200).render('admin/products', {
            user: req.user,
            editMode: true,
            product,
            categories,
            path: '/admin/products',
            errorMessages: req.flash('errorMessages'),
            oldInput: {
                title: '',
                price: '',
                description: '',
                link: '',
                categoryId: '',
                attributes: ''
            },
            errors: [],
            title: 'محصولات'
        });
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postEditProduct = async (req, res, next) => {
    try {
        const {
            title,
            link,
            price,
            description,
            categoryId,
            productId,
            attributes
        } = req.body;

        // express validator
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // needed information
            const editMode = true;
            // find all products
            const product = await Product.findByPk(productId, {
                include: Category
            });
            // find all categories
            const categories = await Category.findAll();
            // re-render
            return res.status(400).render('admin/products', {
                user: req.user,
                product,
                categories,
                editMode,
                path: '/admin/products',
                errorMessages: ['لطفا این فیلد ها را با مقدار مناسب پر کنید'],
                oldInput: {
                    title,
                    price,
                    description,
                    link,
                    categoryId,
                    attributes
                },
                errors: errors.array(),
                title: 'محصولات'
            });
        }

        let image = req.file;
        // find product
        let product = await Product.findByPk(productId);
        //  if new image --- delete old image
        if (image) {
            deleteFile(product.image);
            image = image.path;
            product.image = image;
        }
        product.title = title;
        product.price = price;
        product.description = description;
        product.categoryId = categoryId;
        product.attributes = attributes;
        await product.save();
        res.redirect('/admin/products');
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getCategories = async (req, res, next) => {
    try {
        const editMode = false;
        const categories = await Category.findAll();
        res.status(200).render('admin/categories', {
            user: req.user,
            categories,
            path: '/admin/categories',
            editMode,
            errors: [],
            errorMessages: req.flash('errorMessages'),
            oldInput: { title: '', description: '', link: '' },
            title: 'دسته بندی محصولات'
        });
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postDeleteCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.body;
        const category = await Category.findByPk(categoryId);
        if (
            categoryId == ALL_CATEGORY_ID ||
            categoryId == UNCATEGORIZED_CATEGORY_ID
        ) {
            flashError(
                req,
                res,
                'نمیتوانید این دسته بندی را حذف کنید.',
                '/admin/categories'
            );
        } else {
            // set all products category to uncategorized
            const products = await Product.findAll({
                where: { categoryId: categoryId }
            });
            products.map(async (product) => {
                product.categoryId = UNCATEGORIZED_CATEGORY_ID;
                await product.save();
            });

            await category.destroy();
            res.redirect('/admin/categories');
        }
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postCategory = async (req, res, next) => {
    try {
        const { title, description, link } = req.body;
        // express validator
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const categories = await Category.findAll();
            const editMode = false;
            return res.status(200).render('admin/categories', {
                path: '/admin/categories',
                title: 'دسته بندی محصولات',
                errorMessages: ['این فیلد ها را پر کنید'],
                errors: errors.array(),
                oldInput: { title, description, link },
                categories,
                editMode
            });
        }
        await Category.create({ title, description, link });
        res.redirect('/admin/categories');
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getEditCategory = async (req, res, next) => {
    try {
        const categoryId = req.query.id;
        const categories = await Category.findAll();
        const category = await Category.findByPk(categoryId);

        if (
            category.id == ALL_CATEGORY_ID ||
            category.id == UNCATEGORIZED_CATEGORY_ID
        ) {
            flashError(
                req,
                res,
                'نمیتوانید این دسته بندی ها را ویرایش کنید.',
                '/admin/categories'
            );
        }

        res.status(200).render('admin/categories', {
            path: '/admin/categories',
            title: 'دسته بندی محصولات',
            oldInput: { title: '', link: '', description: '' },
            errorMessages: req.flash('errorMessages'),
            errors: [],
            editMode: true,
            categories,
            category
        });
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postEditCategory = async (req, res, next) => {
    try {
        const { title, description, categoryId, link, attributes } = req.body;
        let category = await Category.findByPk(categoryId);

        // express validator
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const categories = await Category.findAll();
            return res.status(200).render('admin/categories', {
                path: '/admin/categories',
                title: 'دسته بندی محصولات',
                errorMessages: ['این فیلد ها را پر کنید'],
                errors: errors.array(),
                oldInput: { title, description, link },
                editMode: true,
                categories,
                category
            });
        }

        // update product
        category.title = title;
        category.description = description;
        category.link = link;
        category.attributes = attributes;
        await category.save();
        res.redirect('/admin/categories');
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({ include: AccessLevel });
        res.render('admin/users', {
            path: '/admin/users',
            title: 'کاربران',
            errorMessages: req.flash('errorMessages'),
            editMode: false,
            users
        });
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postUpdateUsers = async (req, res, next) => {
    try {
        const { userId, accessLevelId, email, name } = req.body;

        const user = await User.findByPk(userId);
        // update user
        user.accessLevelId = accessLevelId;
        user.email = email;
        user.name = name;

        await user.save();

        res.redirect('/admin/users');
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getEditUsers = async (req, res, next) => {
    try {
        const userId = req.query.id;
        // find users
        const user = await User.findByPk(userId, { include: AccessLevel });
        const users = await User.findAll({ include: AccessLevel });

        // if user is super admin
        if (user.id == ADMIN_USER_ID) {
            flashError(
                req,
                res,
                ' ادمین اصلی را نمیتوانید ادیت کنید',
                '/admin/users'
            );
        } else {
            res.render('admin/users', {
                path: '/admin/users',
                title: 'کاربران',
                errorMessages: req.flash('errorMessages'),
                editMode: true,
                users
            });
        }
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getComments = async (req, res, next) => {
    try {
        const comments = await Comment.findAll({
            include: Product,
            order: [['commentStatusId', 'ASC']]
        });

        res.render('admin/comments', {
            comments,
            path: '/admin/comments',
            title: 'کامنت ها',
            user: req.user
        });
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postCommentStatus = async (req, res, next) => {
    try {
        const { commentStatusId, commentId } = req.body;
        const comment = await Comment.findByPk(commentId);
        // set comment status
        comment.commentStatusId = commentStatusId;
        await comment.save();

        res.redirect('/admin/comments');
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postDeleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.body;
        const { product_query } = req.query;

        const comment = await Comment.findByPk(commentId);

        await comment.destroy();

        // if delete comment from product-page
        if (product_query) {
            return res.redirect('/product/' + product_query);
        }
        // if delte comment from comment-page
        else {
            res.redirect('/admin/comments');
        }
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getMainPage = async (req, res, next) => {
    try {
        const views = await MainPage.findAll({ include: MainPageType });
        const viewTypes = await MainPageType.findAll();

        const editMode = false;

        // return res.json({views})
        res.status(200).render('admin/main-page', {
            path: '/admin/main-page',
            title: 'صفحه اصلی',
            errorMessages: req.flash('errorMessages'),
            views,
            viewTypes,
            editMode
        });
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getEditMainPageView = async (req, res, next) => {
    try {
        const views = [];
        const viewTypes = await MainPageType.findAll();

        const { viewId } = req.query;
        const view = await MainPage.findByPk(viewId);

        if (!view) {
            flashError(req, res, 'پیدا نشد', '/admin/main-page');
        }

        const editMode = true;

        res.status(200).render('admin/main-page', {
            path: '/admin/main-page',
            title: 'صفحه اصلی',
            errorMessages: req.flash('errorMessages'),
            views,
            viewTypes,
            editMode,
            view
        });
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postEditMainPageView = async (req, res, next) => {
    try {
        const { title, link, typeId, viewId } = req.body;

        let image = req.file;
        // find product
        let view = await MainPage.findByPk(viewId);

        if (!view) {
            flashError(req, res, 'پیدا نشد', '/admin/main-page');
        }

        //  if new image --- delete old image
        if (image) {
            deleteFile(view.image);
            image = image.path;
            view.image = image;
        }

        view.title = title;
        view.link = link;
        view.mainPageTypeId = typeId;

        await view.save();
        res.redirect('/admin/main-page');
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postAddMainPageView = async (req, res, next) => {
    try {
        const { title, link, typeId } = req.body;
        const image = req.file;
        // No image
        if (!image) {
            flashError(
                req,
                res,
                'لطفا ابتدا یک تصویر انتخاب کنید',
                '/admin/main-page'
            );
        }

        await MainPage.create({
            title,
            link,
            image: image.path,
            mainPageTypeId: typeId
        });

        res.redirect('/admin/main-page');
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postDeleteMainPageView = async (req, res, next) => {
    try {
        const { viewId } = req.body;
        const mainPage = await MainPage.findByPk(viewId);

        if (!mainPage) {
            flashError(req, res, 'پیدا نشد', '/admin/main-page');
        }
        // delete image from storage
        if (mainPage.image) {
            deleteFile(mainPage.image);
        }

        await mainPage.destroy();

        res.redirect('/admin/main-page');
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postAddMainPageType = async (req, res, next) => {
    try {
        const { title, link } = req.body;

        await MainPageType.create({
            title,
            link
        });

        res.redirect('/admin/main-page');
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postDeleteMainPageType = async (req, res, next) => {
    try {
        const { typeId } = req.body;
        const type = await MainPageType.findByPk(typeId);

        if (!type) {
            flashError(req, res, 'پیدا نشد', '/admin/main-page');
        }

        await type.destroy();

        res.redirect('/admin/main-page');
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
};
