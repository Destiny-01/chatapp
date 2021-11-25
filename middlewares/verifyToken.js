const jwt = require("jsonwebtoken");

const verifyAuthorization = (req, res, next) => {
  const authToken = req.cookies.jwt;
  if (!authToken) {
    return res.redirect("/users/login");
  }
  jwt.verify(authToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.redirect("/users/login");
    }
    req.user = user;
    res.locals.currentUser = user;
    console.log(user);
    next();
  });
};

const verifyAuthorized = (req, res, next) => {
  const authToken = req.cookies.jwt;
  if (authToken) {
    return res.redirect("/rooms");
  }
  next();
};

module.exports = {
  verifyAuthorization,
  verifyAuthorized,
};
