module.exports = function () {
  return function (req, res, next) {
    if (req.user) {
      let userInfo = {
        username: req.user.username,
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName
      }
      res.locals.user = userInfo;
    }
    next();
  };
};