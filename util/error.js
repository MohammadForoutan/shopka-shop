const flashError = (request, result, message, redirectAddress) => {
    request.flash('errorMessages', [message]);

    request.session.save((error) => {
        console.log(error);
        return result.redirect(redirectAddress);
    });
};

const expressErrHandler = (error , next) => {
    const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
}

module.exports = {
    flashError,
    expressErrHandler
};
