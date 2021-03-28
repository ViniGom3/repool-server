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
    const result = await prisma.user.findUnique({
      where: {
        id
      }
    })
    const { password, ...user } = result
    res.json(user)
  } catch (err) {
    console.log(err)
  }
})

router.patch("/:id/user", async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { name, avatar, tel, cel } = req.body
    const { isMan } = req.body as unknown as { isMan: boolean }
    if (id !== req.loggedUserId) {
      res.status(403).json({ "error": "Você não está autorizado a fazer essa operação" })
    } else {
      const result = await prisma.user.update({
        where: {
          id
        },
        data: {
          name,
          isMan,
          avatar,
          tel,
          cel
        }
      }
      )

      const { password, ...user } = result
      res.json(user)
    }
  } catch (err) {
    console.log(err)
  }
})



export default router