import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'
import jsonwebtoken from 'jsonwebtoken';
import { findEmail, findByEmail } from '../helpers/user'

const prisma = new PrismaClient()
const router = Router()

router.get("/:id/user", async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const user = await prisma.user.findUnique({
      where: {
        id
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