module.exports = function () {
  return function (req, res, next) {
    res.locals.user.username = req.user.username;
    res.locals.user.id = req.user._id;
    res.locals.user.firstName = req.user.firstName;
    res.locals.user.lastName = req.user.lastName;
    next();
  };
};