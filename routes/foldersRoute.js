const express = require("express");
const foldersRouter = express.Router();
const { getRootFolders, postUploadFile, uploadfile, createNewFolder, getSubFolder, deleteFolder} = require("../controllers/foldersController");

foldersRouter.get("/", getRootFolders);
foldersRouter.get("/:folder", getSubFolder);
foldersRouter.post("/uploadfile", uploadfile().single("file"), postUploadFile)
foldersRouter.post("/newfolder",  createNewFolder)
foldersRouter.get("/deleteFolder/:folder", deleteFolder);

module.exports = {
  foldersRouter,
}