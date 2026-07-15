const express = require("express")
const indexRouter = express.Router();
const { getHomePage, getSignup, getLogin, postSignup } = require("../controllers/indexController")

indexRouter.get("/", getHomePage);
indexRouter.get("/login", getLogin);
indexRouter.get("/signup", getSignup);
indexRouter.post("/signup", postSignup);

module.exports = {
  indexRouter,
}