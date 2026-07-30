const express = require("express");
const foldersRouter = express.Router();
const busboy = require('connect-busboy');
require("dotenv").config();
const cloudinary = require('cloudinary').v2;
console.log(cloudinary.config().cloud_name)
const { checkIfFileExists, deletefileById, getFileById, getFoldersByUserId, creatNewFolder, getFoldersByFolderId , getRootFolder, deleteFolderById, createFile} = require("../utilities/queries")

const getRootFolders = async (req, res) =>{
  if (req.user != undefined){
    const rootFolder = await getRootFolder(parseInt(req.user.id))
    res.render("subFolder", {user: req.user, folder: rootFolder})
  }else{
    res.redirect("/login")
  }
}


const postUploadFile = async (req, res, next) => {
  if (!req.busboy) {
    return res.redirect("/folders");
  }

  const fields = {};

  const uploadPromise = new Promise((resolve, reject) => {
    req.busboy.on('field', (name, value) => {
      fields[name] = value;
    });

    req.busboy.on('file', (name, file, info) => {
      const stream = cloudinary.uploader.upload_stream(
        { use_filename: true, 
          unique_filename: false,
          filename_override: info.filename,
          resource_type: "auto",
          context: { title: info.filename }
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      file.pipe(stream);
    });

    req.busboy.on('error', reject);
  });

  req.pipe(req.busboy);

  const result = await uploadPromise;
  const alreadyexists = await checkIfFileExists(result.public_id);
  if (!alreadyexists){
    await createFile(fields, result.url, result.public_id, result.resource_type, result.display_name);
  }
  res.redirect(`/folders/${fields.folder}`);
};

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

async function getAllDescendantFolderIds(folderId) {
  let folderIds = [folderId];
  const folder = await getFoldersByFolderId(folderId);
  if (folder.childrenFolders.length < 1) {
    return folderIds;
  }else{
    const descendantIdArrays = await Promise.all(
      folder.childrenFolders.map((subFolder) => getAllDescendantFolderIds(subFolder.id))
    );
    folderIds = folderIds.concat(descendantIdArrays.flat());
  }

  return folderIds;
}

const deleteFolder = async (req, res) => {
  const folderId = parseInt(req.params.folder)
  
  if (req.user != undefined){
    const folder = await getFoldersByFolderId(folderId);
    const subFolders = await getAllDescendantFolderIds(folderId);
    for (let i = 0 ; i < subFolders.length ; i++) {
      const subFolder = await getFoldersByFolderId(subFolders[i]);
      for (let j = 0 ; j < subFolder.files.length ; j++){
        const file = await getFileById(subFolder.files[j].id);
        try {
          await cloudinary.uploader.destroy(file.publicId, { resource_type: file.fileType}).then(result => console.log(result))
        } catch (err){
          console.error(err);
        }
      }
    }
    const parentFolderId = folder.parentFolderId;
    const deleteFolder = await deleteFolderById(folderId);
    res.redirect(`/folders/${parentFolderId}`)
  }else{
    res.redirect("/login")
  }
}



const deleteFile = async (req, res) => {
  const fileId = parseInt(req.params.fileid)

  if (req.user != undefined){
    const file = await getFileById(fileId);
    try {
      await cloudinary.uploader.destroy(file.publicId, { resource_type: file.fileType}).then(result => console.log(result))
    } catch (err){
      console.error(err);
    }
    
    const parentFolderId = file.parentFolderId;
    const deleteFile = await deletefileById(fileId);
    res.redirect(`/folders/${parentFolderId}`)
  }else{
    res.redirect("/login")
  }
}

module.exports = {
  getRootFolders,
  postUploadFile,
  createNewFolder,
  getSubFolder,
  deleteFolder,
  deleteFile
}