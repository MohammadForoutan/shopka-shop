const isAdmin = (req) => {
    if(req.user.accessLevelId == 2) {
        return true;
    } 
    else {
        return false;
    }
}

module.exports = {
    isAdmin
}