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
}