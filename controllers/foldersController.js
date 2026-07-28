const express = require("express");
const foldersRouter = express.Router();
const multer  = require('multer');
const path = require("node:path");
const fs = require("node:fs");
const fileURLToPath = require("url");
const { getFoldersByUserId, creatNewFolder, getFoldersByFolderId , getRootFolder, deleteFolderById} = require("../utilities/queries")



const uploadfile = () => {
  const uploaddir="./upload"
  //check if no folder then create
  if (!fs.existsSync(uploaddir)) {
      fs.mkdirSync(uploaddir)
  }
  const storage= multer.diskStorage({
      destination: function (req,file,cb){
        const uploaddir=`./uploads/${req.user.id}`
        //check if no folder then create
        if (!fs.existsSync(uploaddir)) {
            fs.mkdirSync(uploaddir)
        }
        cb(null,uploaddir)
      },
      filename: function (req, file, cb) {
          cb(null , Date.now() + "--" + file.originalname)
        }
  })

  const upload = multer({storage, 
    limits:{
      fileSize: 5*1024*10240,//1MB
      files: 1 // Single file upload
    }
  })
  return upload
}

const getRootFolders = async (req, res) =>{
  if (req.user != undefined){
    const rootFolder = await getRootFolder(parseInt(req.user.id))
    res.render("subFolder", {user: req.user, folder: rootFolder})
  }else{
    res.redirect("/login")
  }
}


const postUploadFile = async (req, res, next) => {
  res.redirect("/folders");
}

const createNewFolder = async (req, res, next) => {
  const userId = parseInt(req.body.userId)
  const folderId = parseInt(req.body.folderId)
  const folderName = req.body.folderName
  
  const newFolder = await creatNewFolder(folderId, folderName, userId)

  res.redirect(`/folders/${newFolder.id}`)
}

const getSubFolder = async (req, res) => {
  const folderId = parseInt(req.params.folder)
  if (req.user != undefined){
    const folder = await getFoldersByFolderId(folderId);
    res.render("subFolder", {user: req.user, folder: folder})
  }else{
    res.redirect("/login")
  }
}

const deleteFolder = async (req, res) => {
  const folderId = parseInt(req.params.folder)
  
  if (req.user != undefined){
    const folder = await getFoldersByFolderId(folderId);
    const parentFolderId = folder.parentFolderId;
    const deleteFolder = await deleteFolderById(folderId);
    res.redirect(`/folders/${parentFolderId}`)
  }else{
    res.redirect("/login")
  }
}

module.exports = {
  getRootFolders,
  postUploadFile,
  uploadfile,
  createNewFolder,
  getSubFolder,
  deleteFolder
}