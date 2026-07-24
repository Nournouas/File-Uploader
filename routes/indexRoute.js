const express = require("express")
const indexRouter = express.Router();
const { getHomePage, getSignup, getLogin, postSignup, getLogout } = require("../controllers/indexController");
const passport = require("passport");

indexRouter.get("/", getHomePage);
indexRouter.get("/login", getLogin);
indexRouter.get("/signup", getSignup);
indexRouter.post("/signup", postSignup);
indexRouter.post("/login",
  passport.authenticate("local", {
  successRedirect: "/folders",
  failureRedirect: "/error",
  failureMessage: true,
}
));
indexRouter.get("/logout", getLogout)

module.exports = {
  indexRouter,
}