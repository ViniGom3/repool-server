import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const findEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    },
    select: {
      id: true
    }
  })
  return user
}

export const findByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    },
    include: {
      profile: true
    },

  })
  return user
}