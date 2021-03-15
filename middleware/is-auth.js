module.exports = (req, res, next) => {
    const user = req.user;
    // if user not found = user not log in
    if(!user) {
        req.flash('errorMessages', ['لطفا ابتدا وارد حساب خود شوید']);
        req.session.save(err => {
            console.log(err);
            return res.redirect('/auth/login');
        })
        return;
    }
    next();
}