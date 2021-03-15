module.exports = (req, res, next) => {
    const user = req.user;
    // if user not found = user not log in
    if(user.accessLevelId < 2) {
        req.flash('errorMessages', ['شما ادمین نیستی داداش']);
        req.session.save(err => {
            console.log(err);
            return res.redirect('/');
        })
        return;
    }
    next();
}
