import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'
import { findEmail } from '../helpers/user'

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
        cel: true,
        profile: {
        }
      }
    })

    res.json(allUsers)
  } catch (err) {
    console.log(err)
  }
})

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

router.post("/user", async (req, res) => {
  try {
    console.log(req.body)
    const { name, email, password, role, tel, cel, isMan, bio } = req.body;

    const user = findEmail(email)

    if (user) {
      res.status(400).json({ error: "email já existe" })
    } else {

      const hash = await argon2.hash(password);

      const createdUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hash,
          role,
          isMan,
          profile: {
            create: {
              bio
            }
          },
          tel,
          cel
        }
      })

      res.json(createdUser)
    }
  } catch (err) {
    console.log(err)
  }
})

router.get("/email", async (req, res) => {
  try {
    const { email } = req.body

    const user = await findEmail(email)

    res.json(!!user)
  } catch (err) {
    console.log(err)
  }
})


export default router

