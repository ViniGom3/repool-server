import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

router.get("/users", async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        password: false,
        name: true,
        email: true,
        role: true,
        tel: true,
        cel: true
      }
    })

    res.json(allUsers)
  } catch (err) {
    console.log(err)
  }
})

router.get("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id)
    console.log(userId)
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        password: false,
        name: true,
        email: true,
        role: true,
        tel: true,
        cel: true
      }
    })

    res.json(user)
  } catch (err) {
    console.log(err)
  }
})

export default router

