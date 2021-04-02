import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { checkIfSameUser } from '../helpers/subscribers'

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
        name: true,
        avatar: true,
        isMan: true,
        profile: true,
        property: true
      }
    })
    res.json(user)
  } catch (err) {
    console.log(err)
  }
})

router.get("/:id/full-user", async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    // @ts-ignore
    checkIfSameUser(id, req.loggedUserId, res)

    const result = await prisma.user.findUnique({
      where: {
        id
      },
      include: {
        profile: true,
        property: true,
        interests: true,
        favorited: true,
        evaluate: true
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
    checkIfSameUser(id, req.loggedUserId, res)

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

  } catch (err) {
    console.log(err)
  }
})

router.delete("/:id/user", async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    // @ts-ignore
    checkIfSameUser(id, req.loggedUserId, res)

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
  try {
    const id = parseInt(req.params.id)
    // @ts-ignore
    checkIfSameUser(id, req.loggedUserId, res)

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

router.patch("/user/:user_id/property/:property_id/favorites", async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id)
    const id = parseInt(req.params.property_id)
    // @ts-ignore
    checkIfSameUser(userId, req.loggedUserId, res)

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
        },
        include: {
          favorited: true
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
        },
        include: {
          favorited: true
        }
      })
    }

    const { password, ...user } = result
    res.json(user)
  } catch (err) {
    console.log(err)
  }
})

router.get("/user/:id/evaluate", async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    // @ts-ignore
    checkIfSameUser(id, req.loggedUserId, res)

    const evaluate = await prisma.user.findUnique({
      where: {
        id
      },
      select: {
        evaluate: true
      }
    })

    res.json(evaluate)
  } catch (err) {
    console.log(err)
  }
})

router.get("/property/:id/evaluate", async (req, res) => {
  try {
    const id = parseInt(req.params.id)


    const result = await prisma.property.findUnique({
      where: {
        id
      },
      select: {
        owner: {
          select: {
            id: true
          }
        },
        evaluate: true
      }
    })

    // @ts-ignore
    checkIfSameUser(result.owner.id, req.loggedUserId, res)

    res.json(result.evaluate)
  } catch (err) {
    console.log(err)
  }
})

router.get("/rent/:id/property", async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    // @ts-ignore
    checkIfSameUser(id, req.loggedUserId, res)

    const result = await prisma.user.findUnique({
      where: {
        id
      },
      include: {
        rent: {
          include: {
            vacancy: {
              include: {
                property: true
              }
            }
          }
        }
      }
    })

    res.json(result)
  } catch (err) {
    console.log(err)
  }
})

router.patch("/user/:user_id/property/:property_id/interest", async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id)
    const id = parseInt(req.params.property_id)

    // @ts-ignore
    checkIfSameUser(userId, req.loggedUserId, res)

    const interest = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        interests: {
          where: {
            id
          }
        }
      }
    })

    let result
    if (interest.interests.length === 0) {
      result = await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          interests: {
            connect: {
              id
            }
          }
        },
        include: {
          interests: true
        }
      })
    } else {
      result = await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          interests: {
            disconnect: {
              id
            }
          }
        },
        include: {
          interests: true
        }
      })
    }

    res.json(result)

  } catch (err) {
    console.log(err)
  }
})

export default router