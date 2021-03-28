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

router.post("/:id/user", async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { name, avatar, tel, cel } = req.body
    const { isMan } = req.body as unknown as { isMan: boolean }
    if (id !== req.loggedUserId) {
      res.status(403).json({ "error": "Você não está autorizado a fazer essa operação" })
    } else {
      const user = await prisma.user.update({
        where: {
          id
        },
        data: {
          name,
          isMan,
          avatar,
          tel,
          cel
        },
      })

      res.json(user)
    }
  } catch (err) {
    console.log(err)
  }
})

export default router