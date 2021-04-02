import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'
import { findEmail, findByEmail, createJWT } from '../helpers/user'


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

      const jwt = await createJWT(createdUser.id)
      const userAndJwt = [createdUser, jwt]
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
  const { hasPool, hasGarage, hasGourmet, hasInternet, isPetFriendly } = req.query as unknown as { hasPool: boolean, hasGarage: boolean, hasGourmet: boolean, hasInternet: boolean, isPetFriendly: boolean };

  let result
  if (!!search) {
    result = await prisma.ad.findMany({
      select: {
        property: {
          select: {
            id: true,
            name: true,
            city: true,
            neighborhood: true,
            street: true
          }
        }
      },
      where: {
        OR: [
          {
            property: {
              name: {
                contains: search,
                mode: "insensitive"
              },
              hasGarage: !!hasGarage,
              hasGourmet: !!hasGourmet,
              hasInternet: !!hasInternet,
              hasPool: !!hasPool,
              isPetFriendly: !!isPetFriendly
            }
          }, {
            property: {
              neighborhood: {
                contains: search,
              },
              hasGarage: !!hasGarage,
              hasGourmet: !!hasGourmet,
              hasInternet: !!hasInternet,
              hasPool: !!hasPool,
              isPetFriendly: !!isPetFriendly
            }
          },
          {
            property: {
              city: {
                contains: search,
              },
              hasGarage: !!hasGarage,
              hasGourmet: !!hasGourmet,
              hasInternet: !!hasInternet,
              hasPool: !!hasPool,
              isPetFriendly: !!isPetFriendly
            }
          },
          {
            property: {
              description: {
                contains: search,
                mode: "insensitive"
              },
              hasGarage: !!hasGarage,
              hasGourmet: !!hasGourmet,
              hasInternet: !!hasInternet,
              hasPool: !!hasPool,
              isPetFriendly: !!isPetFriendly
            }
          }
        ]
      }
    })
  } else {
    result = await prisma.ad.findMany({
      include: {
        property: true
      },
      where: {
        property: {
          hasGarage: !!hasGarage,
          hasGourmet: !!hasGourmet,
          hasInternet: !!hasInternet,
          hasPool: !!hasPool,
          isPetFriendly: !!isPetFriendly
        }
      }
    })
  }

  res.json(result)
})

export default router

