const AccessLevel = require('../models/access-level');
const Category = require('../models/category');
const Product = require('../models/product');
const User = require('../models/user');
const Comment = require('../models/comment');
const MainPage = require('../models/main-page')
const { validationResult } = require('express-validator');

// util
const { deleteFile } = require('../util/file');
const { flashError } = require('../util/error')

exports.getAdmin = (req, res, next) => {
    res.status(200).render('admin/dashboard', {
        path: '/admin',
        user: req.user,
        title: 'داشبورد'
    });
};

exports.getProducts = async (req, res, next) => {
    try {
        const editMode = false;
        // find all products
        const products = await Product.findAll({ include: Category });
        // find all categories
        const categories = await Category.findAll();
        res.status(200).render('admin/products', {
            user: req.user,
            products,
            product: {},
            categories,
            editMode,
            errorMessages: req.flash('errorMessages'),
            path: '/admin/products',
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
        console.log(error);
    }
};

exports.postAddProduct = async (req, res, next) => {
    try {
        // image
        let image = req.file;
        if (!image) {
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

        console.log(req.body);

        // express validator
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // needed information
            const editMode = false;
            // find all products
            const products = await Product.findAll({ include: Category });
            // find all categories
            const categories = await Category.findAll();
            // re-render
            return res.status(400).render('admin/products', {
                user: req.user,
                products,
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
        console.log(error);
    }
};

exports.postDeleteProduct = async (req, res, next) => {
    const { productId } = req.body;
    try {
        const product = await Product.findByPk(productId);
        // delete image from storage
        if(product.image) {
            deleteFile(product.image);
        }
        await product.destroy();
        res.redirect('/admin/products');
    } catch (error) {
        console.log(error);
    }
};

exports.getEditProduct = async (req, res, next) => {
    const productId = req.query.id;
    try {
        // find product and its category
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
        console.log(error);
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

        console.log(productId);

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
        console.log(error);
    }
};

exports.getCategories = async (req, res, next) => {
    // get all categories
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
        console.log(error);
    }
};

exports.postDeleteCategory = async (req, res, next) => {
    const { categoryId } = req.body;
    try {
        // find category
        const category = await Category.findByPk(categoryId);
        // cant't delete uncategorized category
        if (
            categoryId == 1 ||
            category.link.toLowerCase() == 'uncategorized' ||
            category.link.toLowerCase() == 'all'
        ) {
            flashError(req ,res,'نمیتوانید این دسته بندی را حذف کنید.', '/admin/categories' )
        } else {
            // set all products with that category to uncategorized
            const products = await Product.findAll({
                where: { categoryId: categoryId }
            });
            products.map(async (p) => {
                p.categoryId = 1;
                await p.save();
            });
            // delete category
            await category.destroy();
            // redirect
            res.redirect('/admin/categories');
        }
    } catch (error) {
        console.log(error);
    }
};

exports.postCategory = async (req, res, next) => {
    const { title, description, link } = req.body;
    try {
        // express validator
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // needed information
            const categories = await Category.findAll();
            // editMode
            const editMode = false;
            // re-render
            return res.status(200).render('admin/categories', {
                user: req.user,
                categories,
                path: '/admin/categories',
                editMode,
                errorMessages: ['این فیلد ها را پر کنید'],
                errors: errors.array(),
                oldInput: { title, description, link },
                title: 'دسته بندی محصولات'
            });
        }
        const category = await Category.create({ title, description, link });
        res.redirect('/admin/categories');
    } catch (error) {
        console.log(error);
    }
};

exports.getEditCategory = async (req, res, next) => {
    const categoryId = req.query.id;
    try {
        // find all categories
        const categories = await Category.findAll();
        // find product and its category
        const category = await Category.findByPk(categoryId);

        // protect sensetive category :))
        if (
            category.id == 1 ||
            category.link.toLowerCase() == 'uncategorized' ||
            category.link.toLowerCase() == 'all'
        ) {
            flashError(req, res,'نمیتوانید این دسته بندی ها را ویرایش کنید.', '/admin/categories' )
        }

        res.status(200).render('admin/categories', {
            user: req.user,
            editMode: true,
            categories,
            category,
            errors: [],
            errorMessages: req.flash('errorMessages'),
            path: '/admin/categories',
            oldInput: { title: '', link: '', description: '' },
            title: 'دسته بندی محصولات'
        });
    } catch (error) {
        console.log(error);
    }
};

exports.postEditCategory = async (req, res, next) => {
    try {
        const { title, description, categoryId, link, attributes } = req.body;

        let category = await Category.findByPk(categoryId);

        // express validator
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // needed information
            const categories = await Category.findAll();
            // editMode
            const editMode = true;
            // re-render
            return res.status(200).render('admin/categories', {
                user: req.user,
                categories,
                path: '/admin/categories',
                editMode,
                category,
                errorMessages: ['این فیلد ها را پر کنید'],
                errors: errors.array(),
                oldInput: { title, description, link },
                title: 'دسته بندی محصولات'
            });
        }

        category.title = title;
        category.description = description;
        category.link = link;
        await category.save();
        res.redirect('/admin/categories');
    } catch (error) {
        console.log(error);
    }
};

exports.getAccesses = async (req, res, next) => {
    try {
        // find all users
        const users = await User.findAll({ include: AccessLevel });

        res.render('admin/accesses', {
            users,
            path: '/admin/accesses',
            errorMessages: req.flash('errorMessages'),
            editMode: false,
            user: req.user,
            title: 'کاربران'
        });
    } catch (error) {
        console.log(error);
    }
};

exports.postAccesses = async (req, res, next) => {
    try {
        const { userId, accessLevelId, accessLevel, email, name } = req.body;
        // find user
        const user = await User.findByPk(userId);
        // set new data
        // user.accessLevel = accessLevel;
        user.accessLevelId = accessLevelId;
        user.email = email;
        user.name = name;

        // save changes -- update
        await user.save();

        res.redirect('/admin/accesses');
    } catch (error) {
        console.log(error);
    }
};

exports.getEditAccesses = async (req, res, next) => {
    try {
        const userId = req.query.id;
        // find users
        const user = await User.findByPk(userId, { include: AccessLevel });
        const users = await User.findAll({ include: AccessLevel });

        // if user is super admin
        if (user.id == 1) {
            flashError(req, res, ' ادمین اصلی را نمیتوانید ادیت کنید', '/admin/accesses');
        } else {
            res.render('admin/accesses', {
                user,
                users,
                editMode: true,
                path: '/admin/accesses',
                errorMessages: req.flash('errorMessages'),
                title: 'کاربران'
            });
        }
    } catch (error) {
        console.log(error);
    }
};

exports.getComments = async (req, res, next) => {
    try {
        const comments = await Comment.findAll({
            include: Product,
            order: [['commentStatusId', 'ASC' ]]
        });

        res.render('admin/comments', {
            comments,
            path: '/admin/comments',
            title: 'کامنت ها',
            user: req.user
        });
    } catch (error) {
        console.log(error);
    }
};

exports.postCommentStatus = async (req, res, next) => {
    try {
        const { commentStatusId, commentId } = req.body;
        const comment = await Comment.findByPk(commentId);
        console.log(req.body);
        comment.commentStatusId = commentStatusId;
        await comment.save();
        res.redirect('/admin/comments');
    } catch (error) {
        console.log(error);
    }
};

exports.postDeleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.body;
        const {product_query} = req.query;

        const comment = await Comment.findByPk(commentId);

        await comment.destroy();

        // if delete comment from product-page
        if(product_query) {
            return res.redirect('/product/'+ product_query);
        } else {
            // if delte comment from comment-page
            res.redirect('/admin/comments');
        }
    } catch (error) {
        console.log(error);
    }
};

exports.getmainPage = async(req, res, next) => {
    try {
        const sliders = await MainPage.findAll({where: {type: 'slider'}});
        const posters = await MainPage.findAll({where: {type: 'poster'}});

        res.status(200).render('admin/main-page', {
        path: '/admin/main-page',
        user: req.user,
        errorMessages: req.flash('errorMessages'),
        title: 'صفحه اصلی',
        sliders,
        posters
    })
    } catch (error) {
        console.log(error);
    }
}

exports.postAddSliderImage = async(req, res, next) => {
    try {

        const {title, link } = req.body;
        const image = req.file;
        // No image
        if(!image) {
            flashError(req, res, 'لطفا ابتدا یک تصویر انتخاب کنید', '/admin/main-page')
        }

        await MainPage.create({
            title,
            link,
            type: 'slider',
            image: image.path,
        })

        res.redirect('/admin/main-page')
    } catch (error) {
        console.log(error);
    }
}

exports.postDeleteSldierImage = async(req, res, next) => {
    try {
        const {sliderId} = req.body;

        
        const slider = await MainPage.findByPk(sliderId);
        // delete image from storage
        if(slider.image) {
            deleteFile(slider.image)
        }

        await slider.destroy();

        res.redirect('/admin/main-page')
    } catch (error) {
        console.log(error);
    }
}

exports.postAddPoster = async(req, res, next) => {
    try {

        const {title, link } = req.body;
        const image = req.file;
        // No image
        if(!image) {
            flashError(req, res, 'لطفا ابتدا یک تصویر انتخاب کنید', '/admin/main-page')
        }

        await MainPage.create({
            title,
            link,
            type: 'poster',
            image: image.path,
        })

        res.redirect('/admin/main-page');
    } catch (error) {
        console.log(error);
    }
}

exports.postDeletePosterImage = async(req, res, next) => {
    try {
        const {posterId} = req.body;
        const poster = await MainPage.findByPk(posterId);

        // delete image from storage
        if(poster.image) {
            deleteFile(poster.image)
        }
        await poster.destroy();

        res.redirect('/admin/main-page')
    } catch (error) {
        console.log(error);
    }
}