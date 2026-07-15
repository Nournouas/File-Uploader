const express = require("express")
const passport = require("passport");
const path = require("node:path")
const { indexRouter } = require("./routes/indexRoute")
const { foldersRouter } = require("./routes/foldersRoute")

const expressSession = require("express-session");
require('dotenv').config()
const{ PrismaSessionStore } = require("@quixo3/prisma-session-store")
const { prisma } = require("./lib/prisma.js")

const app = express();
const port = process.env.PORT;

app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: 'a santa at nasa',
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);
require("./utilities/passport");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.session())

//ejs setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));



app.use('/', indexRouter);
app.use('/folders', foldersRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});