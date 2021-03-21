const path = require('path');
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const csrf = require('csurf');
const bodyParser = require('body-parser');
const flash = require('connect-flash');

const { upload } = require('./util/file');


// Models
const Comment = require('./models/comment');
const User = require('./models/user');
const Product = require('./models/product');
const AccessLevel = require('./models/access-level');
const Cart = require('./models/cart');
const Category = require('./models/category');
const CartItem = require('./models/cart-item');
const OrderItem = require('./models/order-item');
const Order = require('./models/order');
const CommentStatus = require('./models/comment_status');

// Routes-path
const authRoute = require('./routes/auth');
const shopRoute = require('./routes/shop');
const adminRoute = require('./routes/admin');

// Test Database Connection
const db = require('./configs/database');
const { isAdmin } = require('./util/user');

try {
    (async () => {
        await db.authenticate();
        console.log('CONNECTION HAS BEEN ESTABLISHED SUCCESSFULLY.');
    })();
} catch (error) {
    console.log('Unable to connect to database: ==> ', error);
}

// APP
const app = express();

// App set
app.set('view engine', 'ejs');
app.set('views', 'views');

// Public
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// upload
app.use(upload.single('image'));

// Body-Parser
app.use(bodyParser.urlencoded({ extended: true }));



// intialize flash
app.use(flash());

// Sessions
const store = new SequelizeStore({ db, tableName: 'sessions' });

app.use(
    session({
        name: 'session',
        resave: false,
        saveUninitialized: false,
        secret: '12345',
        store: store
    })
);
store.sync();
// csrf
const csrfProtection = csrf();
app.use(csrfProtection);


// USER SETTING
app.use(async (req, res, next) => {
    try {
        if (!req.session.user) {
            req.user = null;
            return next();
        }
        const user = await User.findByPk(req.session.user.id);
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
    }
});

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    res.locals.isAdmin = isAdmin(req);
    res.locals.staticImage = 'http://localhost:3000/';
    next();
});

// Routes
app.use(shopRoute);
app.use('/admin', adminRoute);
app.use('/auth', authRoute);

// DATABASE‌ ASSOCIATION

AccessLevel.hasMany(User, { constraints: true });
User.belongsTo(AccessLevel, { constraints: true });

User.hasMany(Comment, { constraints: true });
Comment.belongsTo(User, { constraints: true });

Product.hasMany(Comment, { constraints: true });
Comment.belongsTo(Product, { constraints: true });

CommentStatus.hasMany(Comment, { constraints: true });
Comment.belongsTo(CommentStatus, { constraints: true });

Category.hasMany(Product, { constraints: true });
Product.belongsTo(Category, { constraints: true });

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

User.hasMany(Order);
Order.belongsTo(User);

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

// Listener
db
    // .sync({alter: true})
    // .sync({force: true})
    .sync()
    .then(() => {
        app.listen(3000, () => {
            console.log(
                '####################################\n    =======> CONNECTED <========\n####################################'
            );
        });
    });
