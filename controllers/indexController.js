const { createUser } = require("../utilities/queries");
const bcrypt = require("bcryptjs");

const getHomePage = (req, res) =>{
  if (req.user != undefined) {
    res.redirect("/folders");
  }else{
    res.render("lander")
  }
}

const getLogin = (req, res) =>{
  if (req.user != undefined) {
    res.redirect("/folders");
  }else{
    res.render("login")
  }
}

const getSignup = (req, res) =>{
  if (req.user != undefined) {
    res.redirect("/folders");
  }else{
    res.render("signup")
  }
}

const postSignup = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  try{
    createUser(req.body.email, hashedPassword);
    res.redirect("/login");
  }catch(err){
    console.error(err)
    return next(err);
  }
}

const getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/")
  })
}


module.exports = {
  getHomePage,
  getLogin,
  getSignup,
  postSignup,
  getLogout,
}