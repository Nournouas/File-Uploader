const { createUser } = require("../utilities/queries");

const getHomePage = (req, res) =>{
  res.render("lander")
}

const getLogin = (req, res) =>{
  res.render("login")
}

const getSignup = (req, res) =>{
  console.log(req.user);
  res.render("signup")
}

const postSignup = async (req, res, next) => {
  console.log(`arguments: ${req.body.email} and ${req.body.password}`)
  try{
    createUser(req.body.email, req.body.password);
  }catch(err){
    console.error(err)
    return next(err);
  }
}


module.exports = {
  getHomePage,
  getLogin,
  getSignup,
  postSignup,
}