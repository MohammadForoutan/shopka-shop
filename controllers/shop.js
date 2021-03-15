const Product = require('../models/product');
const PDFDocument = require('pdfkit');
const Category = require('../models/category');
const Comment = require('../models/comment');
const User = require('../models/user');
const {deleteFile} = require('../util/file')
const bcrypt = require('bcryptjs');

// limit per page
const LIMIT_PER_PAGE = 2;
const ALL_ID = 2; // all_id_category
const ADMIN_ACCESS_LEVEL = 2;
const MEMBER_ACCESS_LEVEL = 1;

exports.getIndex = (req, res, next) => {
    try {
        res.status(200).render('shop/index', {
            path: '/',
            user: req.user,
            errorMessages: req.flash('errorMessages'),
            title: 'فروشگاه شوپکا'
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getShop = async (req, res, next) => {
    try {
        // take data from query
        let { page, categoryId, } = req.query;
        categoryId = categoryId || ALL_ID;
        page = page || 1;
        const offset = LIMIT_PER_PAGE * (page - 1);

        
        let productsDetail;
        let productsCount;
        let products;

        if (+categoryId !== ALL_ID) {
            productsDetail = await Product.count({ where: { categoryId } });
            productsCount = productsDetail;
            products = await Product.findAll({
                where: { categoryId },
                offset,
                limit: LIMIT_PER_PAGE,
            });
        } else {
            productsDetail = await Product.findAndCountAll();
            productsCount = productsDetail.count;
            products = products = await Product.findAll({
                offset,
                limit: LIMIT_PER_PAGE,
            });
        }

        // return res.json({products})

        let pages = Math.ceil(productsCount / LIMIT_PER_PAGE); // all pages

        const categories = await Category.findAll();
        res.status(200).render('shop/shop', {
            categoryId,
            products,
            path: '/shop',
            user: req.user,
            errorMessages: req.flash('errorMessages'),
            categories,
            title: 'فروشگاه',
            pages,
            page,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await Product.findByPk(productId);


        if (!product) {
            req.flash('errorMessages', ['چنین محصولی وجود ندارد.']);
            req.session.save((err) => {
                console.log(err);
                return res.redirect('/shop');
            });
            return;
        }

        // comment
        const comments = await product.getComments({include: User, where: {commentStatusId: 2}});
        // return res.json({comments})

        res.status(200).render('shop/product', {
            product,
            comments,
            user: req.user,
            errorMessages: req.flash('errorMessages'),
            path: '/shop',
            title: 'فروشگاه',
            comment: null,
            commentEditMode: false
        });
    } catch (error) {
        console.log(error);
    }
};

exports.postAddComment = async (req, res, next) => {
    try {
        const { productId, content } = req.body;
        let commentStatusId;

        if(req.user.accessLevelId == ADMIN_ACCESS_LEVEL) {
            commentStatusId = 2;
        } 
        if(req.user.accessLevelId == MEMBER_ACCESS_LEVEL) {
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
        console.log(error);
    }
};

exports.postGetEditComment = async (req, res, next) => {
    try {
        const { productId, commentId } = req.body;

        const product = await Product.findByPk(productId);
        if (!product) {
            req.flash('errorMessages', ['چنین محصولی وجود ندارد.']);
            req.session.save((err) => {
                console.log(err);
                return res.redirect('/shop');
            });
            return;
        }

        // comment
        const comments = await product.getComments({include: User, where: {commentStatusId: 2}});
        
        const comment = await Comment.findByPk(commentId)
        
        if(comment.userId != req.user.id) {
            req.flash('errorMessages', ['این کامنت برای شما نیست'])
            req.session.save(err => {
                console.log(err);
                return res.redirect(`/product/${productId}`);
            })
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
        console.log(error);
    }
}

exports.postPostEditComment = async (req, res, next) => {
    try {
        const {commentId} = req.params;
        const {productId, content} = req.body;

        const comment = await Comment.findByPk(commentId);


        if(comment.userId != req.user.id) {
            req.flash('errorMessages', ['این کامنت برای شما نیست'])
            req.session.save(err => {
                console.log(err);
                return res.redirect(`/product/${productId}`);
            })
        }

        comment.content = content;
        comment.commentStatusId = req.user.accessLevelId

        await comment.save();
        res.redirect(`/product/${productId}`);
    } catch (error) {
        console.log(err);
    }
}

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
        console.log(error);
    }
};

exports.postGetEditProfile = async(req, res, next) => {
    try {
        const {userId} = req.body

        if(+userId !== req.user.id) {
            return res.redirect('/');
        }

        const user = await User.findByPk(userId);

        res.render('shop/profile', {
            editMode: true,
            path: '/profile',
            user: user,
            title: 'پروفایل کاربر'
        })

    } catch (error) {
        console.log(error);
    }
}

exports.postPostEditProfile = async(req, res, next) => {
    try {
        const {userId, name, email, password, confirmPassword} = req.body;
        const user = await User.findByPk(userId);
        
        user.name = name || user.name;
        user.email = email || user.email;

        if(password === confirmPassword) {
            const newPassword = await bcrypt.hash(password, 12);
            user.password = newPassword;
        }

        if(password !== confirmPassword) {
            req.flash('errorMessages', ['رمز عبور و تکرار با هم برابر نبودند'])
            req.session.save(err => {
                console.log(err);
                return res.redirect('/profile')
            })
        }

        await user.save()

        res.redirect('/profile')

    } catch (error) {
        console.log(error);
    }
}

exports.postProfileAvatar = async(req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        let image = req.file;

        
        if (!image) {
            image = '';
        } else {
            deleteFile(user.avatar)
            user.avatar = image.path;
            await user.save();
        }

        res.redirect('/profile');
    } catch (error) {
        console.log(error);
    }
}

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
        console.log(error);
    }
};

exports.postCart = async (req, res, next) => {
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
        console.log(error);
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
        console.log(error);
    }
};

exports.postOrder = async (req, res, next) => {
    try {
        const cart = await req.user.getCart();
        const products = await cart.getProducts();

        if (products.length == 0) {
            req.flash('errorMessages', [
                'با سبد خرید خالی میخوای چی سفارش بدی حاجی؟!'
            ]);
            req.session.save((err) => {
                console.log(err);
                res.redirect('/cart');
            });
            return;
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
        console.log(error);
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
        // res.json({order})

        console.log(order);

        if (!order) {
            req.flash('errorMessages', ['سفارش نادرست است']);
            req.session.save((err) => {
                console.log(err);
                return res.redirect('/order');
            });
            return;
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
        console.log(error);
    }
};
