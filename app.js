const express = require("express")
const expressSession = require("express-session");
require('dotenv').config();
const path = require("node:path")
const { indexRouter } = require("./routes/indexRoute")
const { foldersRouter } = require("./routes/foldersRoute")

const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("./generated/prisma/client.js");
const{ PrismaSessionStore } = require("@quixo3/prisma-session-store")

const connectionString = `${ process.env.DATABASE_URL }`
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//ejs setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: 'a santa at nasa',
    resave: true,
    saveUninitialized: true,
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

app.use('/', indexRouter);
app.use('/folders', foldersRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});