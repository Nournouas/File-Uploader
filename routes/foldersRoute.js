const express = require("express");
const foldersRouter = express.Router();
const { getRootFolders, postUploadFile, uploadfile, createNewFolder} = require("../controllers/foldersController");

foldersRouter.get("/", getRootFolders);
foldersRouter.get("/:folder", (req, res) => {
  res.send("folder!")
});
foldersRouter.post("/uploadfile", uploadfile().single("file"), postUploadFile)
foldersRouter.post("/newfolder",  createNewFolder)

module.exports = {
  foldersRouter,
}