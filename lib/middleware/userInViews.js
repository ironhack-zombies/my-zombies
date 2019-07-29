module.exports = function() {
    return function(req, res, next) {
        if (req.user) {
            let userInfo = {
                username: req.user.username,
                id: req.user._id,
                brains: req.user.brains,
                zombiesOwned: req.user.zombiesOwned,
                gadgetsOwned: req.user.gadgetsOwned
            }
            res.locals.user = userInfo;
        }
        next();
    };
};