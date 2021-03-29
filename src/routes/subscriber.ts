import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

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
    // @ts-ignore
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

router.delete("/:id/user", async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })

    if (!user) {
      res.status(404).json({ "error": "objeto não encontrado" })
    }

    const deleteProfile = prisma.profile.delete({
      where: {
        userId: id
      }
    })

    const deleteUser = prisma.user.delete({
      where: {
        id
      }
    })

    const transaction = await prisma.$transaction([deleteProfile, deleteUser])

    res.json(!!transaction)
  } catch (err) {
    console.log(err)
  }
})

router.get("/:id/favorites", async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const user = await prisma.user.findUnique({
      where: {
        id
      },
      select: {
        favorited: true
      }
    })

    res.json(user)
  } catch (err) {
    console.log(err)
  }
})

router.patch("/:id/favorites", async (req, res) => {
  const userId = parseInt(req.params.id)
  const { id } = req.body
  try {
    const favorites = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        favorited: {
          where: {
            id
          }
        }
      }
    })

    let result
    if (favorites.favorited.length === 0) {
      result = await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          favorited: {
            connect: {
              id
            }
          }
        }
      })
    } else {
      result = await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          favorited: {
            disconnect: {
              id
            }
          }
        }
      })
    }

    const { password, ...user } = result
    res.json(user)
  } catch (err) {
    console.log(err)
  }
})

export default router