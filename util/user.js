const isAdmin = (req) => {
    // not loggedIn
    if(!req || !req.user) {
        return false;
    }
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