import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'
import jsonwebtoken from 'jsonwebtoken';
import { findEmail, findByEmail } from '../helpers/user'


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
        },
        createdAt: true
      }
    })

    res.json(allUsers)
  } catch (err) {
    console.log(err)
  }
})

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, tel, cel, isMan, bio } = req.body;

    const user = await findEmail(email)

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

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await findByEmail(email)

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" })

    } else {
      const { password: hash, id } = user

      const isValid = await argon2.verify(hash, password)

      if (!isValid) {
        res.status(401).json({ error: "Senha incorreta" })
      } else {
        const jwt = jsonwebtoken.sign({ id }, process.env.TOKEN_JWT, { expiresIn: "6h" });
        res.json(jwt)
      }
    }
  } catch (err) {
    console.log(err)
  }


})

router.get("/ad", async (req, res) => {
  const ad = await prisma.ad.findMany({
    include: {
      property: true
    }
  })

  res.json(ad)
})

export default router

