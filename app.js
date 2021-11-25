const express = require("express");
const path = require("path");
const ejs = require("ejs");
const flash = require("connect-flash");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const db = require("./db/db");
const roomRouter = require("./routes/room");
const messageRouter = require("./routes/message");
const usersRouter = require("./routes/users");

const app = express();

app.use(cookieParser("Toppogoooggooo"));
app.use(
  session({
    secret: "obululuoukg secret key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 86400000 },
  })
);
app.use(flash());
app.use(expressLayouts);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
db();

app.use((req, res, next) => {
  // res.locals.message = req.flash();
  // res.locals.currentUser = req.user || null;
  next();
});

// view engine setups
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");

app.use("/rooms", roomRouter);
app.use("/messages", messageRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler

// // error handler
// app.use((err, req, res, next) => {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

module.exports = app;
