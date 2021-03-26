import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

router.get("/users", async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany({})

    res.json(allUsers)
  } catch (err) {
    console.log(err)
  }
})

router.get("/ownerss", async (req, res) => {
  res.json({
    "hi": "hello saddois"
  })
})

export default router

