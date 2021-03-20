const flashError = (request, result, message, redirectAddress) => {
    request.flash('errorMessages', [message]);

    request.session.save((err) => {
        console.log(err);
        return result.redirect(redirectAddress);
    });
};

module.exports = {
    flashError
};
