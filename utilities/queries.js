const { prisma } = require("../lib/prisma");

const createUser = async (email, pswd) => {
  const user = await prisma.user.create({
    data: {
      email: email,
      password: pswd
    }
  });
  console.log(`Created User: ${user} `);
}

module.exports = {
  createUser,
}