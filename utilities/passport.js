const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const { prisma } = require("../lib/prisma");

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email}
      })

      if (!user) {
        return done(null, false, { message: "Incorrect email" });
      }
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password" });
      }
      console.log("all good")
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
        where: { id: id}
      })

    done(null, user);
  } catch(err) {
    done(err);
  }
});
