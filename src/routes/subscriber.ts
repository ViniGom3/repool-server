import { Router } from 'express'
import { PrismaClient, propertyCategory } from '@prisma/client'
import { checkIfSameUser } from '../helpers/subscribers'
import { nextTick } from 'node:process'

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
        sex: true,
        bio: true,
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
        property: true,
        interests: true,
        favorited: true,
        rent: true
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
    const { sex } = req.body
    // @ts-ignore
    checkIfSameUser(id, req.loggedUserId, res)

    const result = await prisma.user.update({
      where: {
        id
      },
      data: {
        name,
        sex,
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

    const deleteInterest = prisma.interest.deleteMany({
      where: {
        userId: id
      }
    })

    const deleteRent = prisma.rent.deleteMany({
      where: {
        renterId: id
      }
    })

    const deleteProperty = prisma.property.delete({
      where: {
        ownerId: id
      }
    })

    const deleteUser = prisma.user.delete({
      where: {
        id
      }
    })

    const transactional = await prisma.$transaction([deleteInterest, deleteRent, deleteProperty, deleteUser])
    res.status(204).json(transactional)
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
    res.status(500).json({ "error": "Houve um erro com o servidor" })
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
        rent: {
          select: {
            value: true,
            comment: true
          }
        }
      }
    })

    res.json(evaluate)
  } catch (err) {
    console.log(err)
    res.status(500).json({ "error": "Houve um erro com o servidor" })
  }
})

router.get("/property/:id/rent", async (req, res) => {
  try {
    const id = parseInt(req.params.id)


    const result = await prisma.property.findUnique({
      where: {
        id
      },
      select: {
        rent: {}
      }
    })

    res.json(result)
  } catch (err) {
    console.log(err)
    res.status(500).json({ "error": "Houve um erro com o servidor" })
  }
})

router.get("/user/:id/rent", async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    // @ts-ignore
    checkIfSameUser(id, req.loggedUserId, res)

    const result = await prisma.user.findUnique({
      where: {
        id
      },
      select: {
        rent: {
          select: {
            property: true
          }
        }
      }
    })

    res.json(result)
  } catch (err) {
    console.log(err)
    res.status(500).json({ "error": "Houve um erro com o servidor" })
  }
})

router.get("/rent/property/:id/user", async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    // @ts-ignore
    const userId = req.loggedUserId

    const result = await prisma.property.findUnique({
      where: {
        id
      },
      select: {
        ownerId: true,
        rent: {
          select: {
            renter: true
          }
        }
      }
    })

    checkIfSameUser(userId, result.ownerId, res)

    res.json(result)
  } catch (err) {
    console.log(err)
    res.status(500).json({ "error": "Houve um erro com o servidor" })
  }
})

router.patch("/user/:user_id/property/:property_id/interest", async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id)
    const propertyId = parseInt(req.params.property_id)

    // @ts-ignore
    checkIfSameUser(userId, req.loggedUserId, res)

    const interest = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        interests: {
          where: {
            propertyId
          }
        }
      }
    })

    let result
    if (interest.interests.length === 0) {
      result = await prisma.interest.create({
        data: {
          userId,
          propertyId
        }
      })
    } else {
      result = await prisma.interest.deleteMany({
        where: {
          userId,
          propertyId
        },

      })
    }

    res.status(204).json(interest)

  } catch (err) {
    console.log(err)
    res.status(500).json({ "error": "Houve um erro com o servidor" })
  }
})


router.post("/user/:user_id/property/:property_id/interest", async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id)
    const propertyId = parseInt(req.params.property_id)

    // @ts-ignore
    checkIfSameUser(userId, req.loggedUserId, res)

    const interest = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        interests: {
          where: {
            propertyId
          }
        }
      }
    })

    if (interest.interests.length !== 0) res.status(400).json({ "error": "Interesse nesta propriedade já foi cadastrado" })

    const result = await prisma.interest.create({
      data: {
        userId,
        propertyId
      }
    })

    res.status(201).json(result)

  } catch (err) {
    console.log(err)
    res.status(500).json({ "error": "Houve um erro com o servidor" })
  }
})

router.patch("/rent/:id/evaluate", async (req, res) => {

  try {
    const rent_id = parseInt(req.params.id)
    // @ts-ignore
    const userId = req.loggedUserId;
    const { value, comment } = req.body as unknown as { value: number, comment: string }

    const result = prisma.rent.update({
      where: {
        id: rent_id,
        renterId: userId
      },
      data: {
        comment,
        value
      }

    })

    res.json(result)
  } catch (err) {
    console.log(err)
    res.status(500).json({ "error": "Houve um erro com o servidor" })
  }
})

router.post("/user/:id/property", async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { name,
      description,
      category,
      vacancyPrice,
      cep,
      street,
      neighborhood,
      city,
      uf,
      country,
      number,
      hasPool,
      hasGarage,
      hasGourmet,
      hasInternet,
      isPetFriendly } = req.body as unknown as {
        name: string,
        description: string,
        category: propertyCategory,
        vacancyPrice: number,
        cep: string,
        street: string,
        neighborhood: string,
        city: string,
        uf: string,
        country: string,
        number: string,
        hasPool: boolean,
        hasGarage: boolean,
        hasGourmet: boolean,
        hasInternet: boolean,
        isPetFriendly: boolean
      }

    const result = prisma.property.create({
      data: {
        name,
        description,
        category,
        vacancyPrice,
        cep,
        street,
        neighborhood,
        city,
        uf,
        country,
        number,
        hasPool,
        hasGarage,
        hasGourmet,
        hasInternet,
        isPetFriendly,
        owner: {
          connect: {
            id
          }
        }
      }
    })

    res.json(result)

  } catch (err) {
    console.log(err)
    res.status(500).json({ "error": "Houve um erro com o servidor" })
  }
})

export default router