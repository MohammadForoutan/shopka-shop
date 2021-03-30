const flashError = (request, result, message, redirectAddress) => {
    request.flash('errorMessages', [message]);

    request.session.save((error) => {
        console.log(error);
        return result.redirect(redirectAddress);
    });
};

module.exports = {
    flashError
};
