const { prisma } = require("../lib/prisma.js");

const createUser = async (email, pswd) => {
  const user = await prisma.user.create({
    data: {
      email: email,
      password: pswd
    }
  });

  await prisma.folder.create({
    data:{
      name: "Root",
      userId: user.id,
      parentFolderId: null
    }
  })
}

const getFoldersByUserId = async (id) => {
  const userFolders = await prisma.user.findUnique({
    where: {id: id},
    include: {folders: true}
  })

  return userFolders.folders
}

const getRootFolder = async (id) => {
  const rootFolder = await prisma.folder.findFirst({
    where: {
      AND: [
        {userId: id},
        {name: "Root"}
      ]},
    include: {files: true, childrenFolders: true}
  })

  return rootFolder;
}

const getFoldersByFolderId = async (id) => {
  const Folder = await prisma.folder.findUnique({
    where: {id: id},
    include: {files: true, childrenFolders: true}
  })

  return Folder
}

const creatNewFolder = async (folderId, folderName, userId) => {
  const folder = await prisma.folder.create({
    data:{
      name: folderName,
      parentFolderId: folderId,
      userId: userId,
    }
  })

  return folder;
}

const deleteFolderById = async (id) => {
  const Folder = await prisma.folder.delete({
    where: {
      id: id,
    }
  })
}

const createFile = async (fields, url, pubId, type, name) => {
  let parentId = parseInt(fields.folder);
  const file = await prisma.file.create({
    data:{
      parentFolderId: parentId,
      fileUrl: url,
      publicId: pubId,
      fileType: type,
      fileName: name,
    }
  })
}

const getFileById = async (id) => {
  const file = await prisma.file.findUnique({
    where: {
      id: id
    },
  })

  return file
}

const deletefileById = async (id) => {
  const file = await prisma.file.delete({
    where: {
      id: id,
    }
  })
}

const checkIfFileExists = async (pubId) => {
  const result = await prisma.file.findFirst({
    where: {
      publicId: pubId,
    }
  })
  return result ? true : false;
}


module.exports = {
  createUser,
  getFoldersByUserId,
  creatNewFolder,
  getFoldersByFolderId,
  getRootFolder,
  deleteFolderById,
  createFile,
  getFileById,
  deletefileById,
  checkIfFileExists
}