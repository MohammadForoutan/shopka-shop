const { flashError } = require('../util/error');

module.exports = (req, res, next) => {
    const user = req.user;
    if (!user) {
        return flashError(
            req,
            res,
            'لطفا ابتدا وارد حساب خود شوید',
            '/auth/login'
        );
    }
    // if user not found = user not log in
    if (user.accessLevelId < 2) {
        flashError(req, res, 'شما ادمین نیستی داداش', '/');
    }
    next();
};
