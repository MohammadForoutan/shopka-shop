const Product = require('../models/product');
const Category = require('../models/category');
const Comment = require('../models/comment');
const User = require('../models/user');
const MainPage = require('../models/main-page');
const MainPageType = require('../models/main-page-type');

const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const PDFDocument = require('pdfkit');
const { deleteFile } = require('../util/file');
const { flashError } = require('../util/error');

const LIMIT_PER_PAGE = 2; // limit per page product in shop-page
const ALL_ID = 2; // all_id_category
const PUBLISHED_COMMENT_ID = 2;

exports.getIndex = async (req, res, next) => {
    try {
        const posters = await MainPage.findAll({
            include: {
                model: MainPageType,
                where: { link: 'poster' }
            },
            limit: 2
        });

        const sliders = await MainPage.findAll({
            include: {
                model: MainPageType,
                where: { link: 'slider' }
            }
        });

        const banners = await MainPage.findAll({
            include: {
                model: MainPageType,
                where: { link: 'category_banner' }
            },
            limit: 4
        });

        const categories = await Category.findAll({
            limit: 4,
            include: { model: Product, limit: 8 }
        });

        res.status(200).render('shop/index', {
            posters,
            sliders,
            banners,
            categories,
            errorMessages: req.flash('errorMessages'),
            title: 'فروشگاه شوپکا',
            path: '/'
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};

exports.postSearch = async (req, res, next) => {
    try {
        const { search } = req.body;

        const results = await Product.findAll({
            where: {
                title: {
                    [Op.like]: `%${search}%`
                }
            },
            limit: 10
        });

        const categories = await Category.findAll();

        res.status(200).render('shop/search-result', {
            path: '/shop',
            title: `نتایج برای "${search}"`,
            errorMessages: req.flash('errorMessages'),
            results,
            categories
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};

exports.getShop = async (req, res, next) => {
    try {
        // take data from query
        let { page, categoryId } = req.query;
        categoryId = categoryId || ALL_ID;
        page = page || 1;
        const offset = LIMIT_PER_PAGE * (page - 1);

        let productsDetail;
        let productsCount;
        let products;

        if (+categoryId !== ALL_ID) {
            results = await Product.findAndCountAll(
                { where: { categoryId },
                 offset,
                 limit: LIMIT_PER_PAGE
                }
            );
            productsCount = results.count;
            products = results.rows;
        } else {
            results = await Product.findAndCountAll(
                {
                    offset,
                    limit: LIMIT_PER_PAGE
                }
            );
            productsCount = results.count;
            products = results.rows;
        }

        let pages = Math.ceil(productsCount / LIMIT_PER_PAGE); // all pages

        const categories = await Category.findAll();
        res.status(200).render('shop/shop', {
            categoryId,
            products,
            path: '/shop',
            errorMessages: req.flash('errorMessages'),
            categories,
            title: 'فروشگاه',
            pages,
            page
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await Product.findByPk(productId);

        if (!product) {
            flashError(req, res, 'چنین محصولی وجود ندارد.', '/shop');
        }

        const relatedProducts = await Product.findAll({
            where: { categoryId: product.categoryId },
            limit: 10
        });
        // comments
        const comments = await product.getComments({
            include: User,
            where: { commentStatusId: PUBLISHED_COMMENT_ID }
        });

        res.status(200).render('shop/product', {
            relatedProducts,
            product,
            comments,
            errorMessages: req.flash('errorMessages'),
            path: '/shop',
            title: 'فروشگاه',
            comment: null,
            commentEditMode: false
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};

exports.postAddComment = async (req, res, next) => {
    try {
        const { productId, content } = req.body;
        let commentStatusId;

        if (req.isAdmin) {
            commentStatusId = PUBLISHED_COMMENT_ID;
        } else {
            commentStatusId = 1;
        }

        await Comment.create({
            content,
            productId,
            userId: req.user.id,
            commentStatusId,
            username: req.user.name
        });
        res.redirect('/product/' + productId);
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};

exports.postGetEditComment = async (req, res, next) => {
    try {
        const { productId, commentId } = req.body;

        const product = await Product.findByPk(productId);
        if (!product) {
            flashError(req, res, 'چنین محصولی وجود ندارد.', '/shop');
        }

        // comment
        const comments = await product.getComments({
            include: User,
            where: { commentStatusId: PUBLISHED_COMMENT_ID }
        });

        const comment = await Comment.findByPk(commentId);

        if (comment.userId != req.user.id) {
            flashError('این کامنت برای شما نیست', `/product/${productId}`);
        }

        res.status(200).render('shop/product', {
            product,
            comments,
            user: req.user,
            path: '/shop',
            title: 'فروشگاه',
            comment,
            commentEditMode: true
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};

exports.postPostEditComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { productId, content } = req.body;

        const comment = await Comment.findByPk(commentId);

        if (comment.userId != req.user.id) {
            flashError(
                req,
                res,
                'این کامنت برای شما نیست',
                `/product/${productId}`
            );
        }

        comment.content = content;
        comment.commentStatusId = req.user.accessLevelId;

        await comment.save();
        res.redirect(`/product/${productId}`);
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};

exports.getProfile = async (req, res, next) => {
    try {
        res.render('shop/profile', {
            editMode: false,
            path: '/profile',
            user: req.user,
            errorMessages: req.flash('errorMessages'),
            title: 'پروفایل کاربر'
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};

exports.postGetEditProfile = async (req, res, next) => {
    try {
        const { userId } = req.body;

        if (+userId !== req.user.id) {
            return res.redirect('/');
        }

        const user = await User.findByPk(userId);

        res.render('shop/profile', {
            editMode: true,
            path: '/profile',
            user: user,
            title: 'پروفایل کاربر'
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};

exports.postPostEditProfile = async (req, res, next) => {
    try {
        const { userId, name, email, password, confirmPassword } = req.body;
        const user = await User.findByPk(userId);

        user.name = name || user.name;
        user.email = email || user.email;

        if (password === confirmPassword) {
            const newPassword = await bcrypt.hash(password, 12);
            user.password = newPassword;
        }

        if (password !== confirmPassword) {
            flashError(
                req,
                res,
                'رمز عبور و تکرار با هم برابر نبودند',
                '/profile'
            );
        }

        await user.save();

        res.redirect('/profile');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};

exports.postProfileAvatar = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        let image = req.file;

        if (!image) {
            image = '';
        } else {
            deleteFile(user.avatar);
            user.avatar = image.path;
            await user.save();
        }

        res.redirect('/profile');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};

exports.getCart = async (req, res, next) => {
    try {
        if (req.user) {
            const cart = await req.user.getCart();
            const products = await cart.getProducts();
            return res.status(200).render('shop/cart', {
                products,
                path: '/cart',
                user: req.user,
                title: 'سبدخرید'
            });
        }
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};

exports.postCart = async (req, res, next) => {
    try {
        const { productId } = req.body;
        let newQuantity = 1;
        let product;
        const cart = await req.user.getCart();
        const products = await cart.getProducts({ where: { id: productId } });

        if (products.length > 0) {
            product = products[0];
        }
        // if product exist in cart
        if (product) {
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1;
        }
        // if product does not exists (NEW PRODUCT)
        if (!product) {
            product = await Product.findByPk(productId);
        }
        await cart.addProduct(product, { through: { quantity: newQuantity } });

        res.redirect('/cart');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};

exports.postDeleteCart = async (req, res, next) => {
    const { productId } = req.body;
    try {
        const cart = await req.user.getCart();
        const products = await cart.getProducts({ where: { id: productId } });
        const product = products[0];
        await product.cartItem.destroy();
        res.redirect('/cart');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};

exports.getOrder = async (req, res, next) => {
    try {
        // GET all orders
        if (req.user) {
            const orders = await req.user.getOrders({ include: Product });
            return res.status(200).render('shop/order', {
                orders,
                path: '/order',
                user: req.user,
                errorMessages: req.flash('errorMessages'),
                title: 'سفارشات شما'
            });
        }
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};

exports.postOrder = async (req, res, next) => {
    try {
        const cart = await req.user.getCart();
        const products = await cart.getProducts();

        if (products.length == 0) {
            flashError(
                req,
                res,
                'با سبد خرید خالی میخوای چی سفارش بدی حاجی؟!',
                '/cart'
            );
        }

        // create order
        const order = await req.user.createOrder();
        const ordoredProducts = products.map((product) => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
        });
        await order.addProducts(ordoredProducts);
        // empty cart items
        await cart.setProducts(null);

        res.redirect('/order');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};

exports.getInvoice = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const orders = await req.user.getOrders({
            where: { id: orderId },
            include: Product
        });
        const order = orders[0];

        if (!order) {
            flashError(req, res, 'سفارش نادرست است', '/order');
        }

        // pdf name
        const invoiceName = 'invoice-' + orderId + '.pdf';

        const pdfDoc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            'inline; filename="' + invoiceName + '"'
        );

        pdfDoc.font('public/fonts/vazir.ttf');
        pdfDoc.fontSize(26).text('رسید سفارش', {
            align: 'right'
        });
        pdfDoc.fontSize(18);

        let totalPrice = 0;

        for (let product of order.products) {
            pdfDoc.text(
                `${product.orderItem.quantity} x ${product.price} = ${
                    product.orderItem.quantity * product.price
                } ------------ ${product.title}`,
                {
                    align: 'right'
                }
            );
            totalPrice =
                totalPrice + product.orderItem.quantity * product.price;
        }

        pdfDoc.text('--------------------------------------------', {
            align: 'center'
        });
        pdfDoc.text(totalPrice + '   تومن ', {
            align: 'right'
        });

        pdfDoc.pipe(res);

        // end pdf
        pdfDoc.end();
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};
