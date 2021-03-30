exports.get404 = async(req, res, next) => {
    try {
        res.status(404).render('errors/404', {
            title: 'صفحه پیدا نشد.',
            path: '/404'
        })
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.get500 = async(req, res, next) => {
    try {
        res.status(500).render('errors/500', {
            title: 'صفحه پیدا نشد.',
            path: '/500'
        })
    } catch (error) {
        const error = new Error(error);
        error.httpStatusCode = 500;
        return next(error);
    }
}