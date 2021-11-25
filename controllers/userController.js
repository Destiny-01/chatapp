const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.registerUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (req.body.password !== req.body.confirmpassword) {
      req.flash("error", "Passwords do not match");
      return res.redirect("/users/login");
    }
    if (existingUser) {
      req.flash(
        "error",
        "Username has been taken. Try logging in or use another username"
      );
      return res.redirect("/users/login");
    }
    const newUser = new User({
      username: req.body.username,
    });
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    newUser.password = hashedPassword;
    await newUser.save();
    const accessToken = jwt.sign(
      {
        id: newUser.id,
        username: newUser.username,
        roomsIn: newUser.roomsIn,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.TOKEN_EXPIRY,
      }
    );

    res.cookie("jwt", accessToken, {
      expires: new Date(Date.now() + 86400000),
      secure: true,
      httpOnly: true,
    });

    req.flash("success", "Registration Successful. Welcome");
    res.redirect("/rooms");
  } catch (err) {
    console.log(err);
    return res.render("error/500");
  }
};

exports.getLogin = async (req, res) => {
  res.render("login", {
    layout: "layouts/login",
    error: req.flash("error"),
    success: req.flash("success"),
  });
};

exports.loginUser = async (req, res) => {
  try {
    const foundUser = await User.findOne({ username: req.body.username });
    if (!foundUser) {
      req.flash("error", "Invalid credentials");
      return res.redirect("/users/login");
    }
    const match = bcrypt.compareSync(req.body.password, foundUser.password);
    if (!match) {
      req.flash("error", "Invalid credentials");
      return res.redirect("/users/login");
    }
    const accessToken = jwt.sign(
      {
        id: foundUser.id,
        username: foundUser.username,
        roomsIn: foundUser.roomsIn,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.TOKEN_EXPIRY,
      }
    );

    res.cookie("jwt", accessToken, {
      expires: new Date(Date.now() + 86400000),
      secure: true,
      httpOnly: true,
    });

    req.flash("success", "Login Successfull. Welcome");

    res.redirect("/rooms");
  } catch (err) {
    console.log(err);
    return res.render("error/500");
  }
};

// exports.getUser = async (req, res) => {
//   const _id = req.params._id;
//   try {
//     const user = await User.findById(_id);
//     if (!user) {
//       return res.render("info", {
//         status: "error",
//         message: "Invalid User",
//       });
//     }

//     return res.render("info", { user });
//   } catch (err) {
//     return res.render("login", {
//       status: "error",
//       message: err,
//     });
//   }
// };

exports.updateUser = async (req, res) => {
  const _id = req.params._id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      req.flash("error", "Invalid user");
      return res.redirect("/users/login");
    }
    if (req.body.password) {
      if (req.body.password !== req.body.confirm_password) {
        req.flash("error", "Passwords don't match");
        return res.redirect("/users/login");
      }
      await User.findByIdAndUpdate(_id, {
        $set: { passsword: req.body.password },
      });
    }

    await User.findByIdAndUpdate(_id, {
      $set: { username: req.body.username },
    });
    req.flash("success", "User updated Successfully");
    return res.redirect("/rooms");
  } catch (err) {
    console.log(err);
    return res.render("error/500");
  }
};

exports.deleteUser = async (req, res) => {
  const _id = req.params._id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      req.flash("error", "Invalid user");
      return res.redirect("/rooms");
    }

    await Ro;

    await User.findByIdAndDelete(_id);

    req.flash("success", "Deleted Account successfully");

    return res.redirect("/");
  } catch (err) {
    console.log(err);
    return res.render("error/500");
  }
};
