const express = require("express")
const foldersRouter = express.Router();
const { getRootFolders } = require("../controllers/foldersController")

foldersRouter.get("/", getRootFolders);

module.exports = {
  foldersRouter,
}