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
  console.log(`Created User: ${user} `);
}

const getFoldersByUserId = async (id) => {
  const userFolders = await prisma.user.findUnique({
    where: {id: id},
    include: {folders: true}
  })

  return userFolders.folders
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

module.exports = {
  createUser,
  getFoldersByUserId,
  creatNewFolder,
}