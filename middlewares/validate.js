const { check, validationResult } = require("express-validator");

exports.registerCheck = async (req, res, next) => {
  if (req.cookies.jwt) {
    res.redirect("/");
  }
  await check("username", "Username is required").notEmpty().run(req);
  await check("password", "Password is required")
    .isLength({ min: 6, max: 24 })
    .notEmpty()
    .run(req);

  const result = validationResult(req);
  console.log(result, "test");

  if (!result.isEmpty()) {
    return res.render("login", {
      status: "error",
      message: result.array(),
    });
  }

  next();
};

exports.loginCheck = async (req, res, next) => {
  await check("username", "Please input a valid username").notEmpty().run(req);
  await check("password", "Password is required").notEmpty().run(req);

  const result = validationResult(req);

  console.log(result, "test");
  if (!result.isEmpty()) {
    return res.render("login", {
      status: "error",
      message: result.array(),
    });
  }

  next();
};
