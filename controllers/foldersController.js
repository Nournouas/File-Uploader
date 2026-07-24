const express = require("express");
const foldersRouter = express.Router();
const multer  = require('multer');
const path = require("node:path");
const fs = require("node:fs");
const fileURLToPath = require("url");
const { getFoldersByUserId, creatNewFolder } = require("../utilities/queries")



const uploadfile = () => {
  const uploaddir="./upload"
  //check if no folder then create
  if (!fs.existsSync(uploaddir)) {
      fs.mkdirSync(uploaddir)
  }
  const storage= multer.diskStorage({
      destination: function (req,file,cb){
        console.log(req.body)
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
    const userFolders = await getFoldersByUserId(req.user.id)
    console.log(userFolders)
    res.render("folders", {user: req.user, folders: userFolders})
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
  
  console.log(creatNewFolder(folderId, folderName, userId))

  res.redirect(`/folders/${folderName}`)
}


module.exports = {
  getRootFolders,
  postUploadFile,
  uploadfile,
  createNewFolder
}