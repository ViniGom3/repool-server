import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'
import { findEmail, findByEmail, createJWT, parseBoolean } from '../helpers/user'


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
        bio: true,
        createdAt: true,
        sex: true
      }
    })

    res.json(allUsers)
  } catch (err) {
    console.log(err)
  }
})

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, tel, cel, sex, bio } = req.body;
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
          sex,
          bio,
          tel,
          cel
        }
      })

      const { password: pass, ...user } = createdUser
      const jwt = await createJWT(createdUser.id)
      const userAndJwt = [user, jwt]
      res.json(userAndJwt)
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
        const jwt = await createJWT(id)
        res.json(jwt)
      }
    }
  } catch (err) {
    console.log(err)
  }
})

router.get("/ad", async (req, res) => {
  const { search } = req.query as unknown as { search: string }
  const { hasPool, hasGarage, hasGourmet, hasInternet, isPetFriendly } = req.query as unknown as { hasPool: string, hasGarage: string, hasGourmet: string, hasInternet: string, isPetFriendly: string }

  const pool = parseBoolean(hasPool)
  const garage = parseBoolean(hasGarage)
  const gourmet = parseBoolean(hasGourmet)
  const internet = parseBoolean(hasInternet)
  const petFriendly = parseBoolean(isPetFriendly)

  let result
  if (!!search) {
    result = await prisma.property.findMany({
      where: {
        isAdversiment: true,
        hasGarage: garage,
        hasPool: pool,
        hasGourmet: gourmet,
        hasInternet: internet,
        isPetFriendly: petFriendly,
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive"
            }
          }, {
            neighborhood: {
              contains: search,
            }
          }, {
            city: {
              contains: search,
            }
          }, {
            description: {
              contains: search,
              mode: "insensitive"
            }
          }
        ]
      }
    })
  } else {
    result = await prisma.property.findMany({
      where: {
        hasGarage: garage,
        hasPool: pool,
        hasGourmet: gourmet,
        hasInternet: internet,
        isPetFriendly: petFriendly
      }
    })
  }

  res.json(result)
})

export default router

