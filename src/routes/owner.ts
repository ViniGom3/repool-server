import { Router } from 'express'
import { PrismaClient, propertyCategory } from '@prisma/client'
import { bothConfirmation, checkIfSameUser } from '../helpers/subscribers'

const prisma = new PrismaClient()
const router = Router()

router.get("/interests", async (req, res) => {
  try {
    // @ts-ignore
    const ownerId = req.loggedUserId;

    const result = await prisma.property.findMany({
      where: {
        ownerId
      },
      select: {
        interests: true
      }
    })

    res.json(result)
  } catch (err) {
    console.log(err)
    res.status(500).json({ "error": "Houve um erro com o servidor" })
  }
})

router.get("/interest", async (req, res) => {
  try {
    // @ts-ignore
    const ownerId = req.loggedUserId;

    const result = await prisma.interest.findMany({
      where: {
        OR: [
          {
            uConfirmation: true
          }, {
            pConfirmation: true
          }
        ],
        Property: {
          ownerId
        }
      }
    })

    res.json(result)
  } catch (err) {
    console.log(err)
    res.status(500).json({ "error": "Houve um erro com o servidor" })
  }
})

router.get("/rent", async (req, res) => {
  try {
    // @ts-ignore
    const propertyId = req.loggedUserId;

    const result = await prisma.rent.findMany({
      where: {
        propertyId
      },
      include: {
        guest: true,
        property: true
      }
    })

    res.json(result)
  } catch (err) {
    console.log(err)
    res.status(500).json({ "error": "Houve um erro com o servidor" })
  }
})

router.delete("/:id/rent", async (req, res) => {
  try {
    // @ts-ignore
    const propertyId = req.loggedUserId;
    const id = parseInt(req.params.id)

    const query = await prisma.rent.findUnique({
      where: {
        id
      }
    })

    checkIfSameUser(query.propertyId, propertyId, res)

    const result = await prisma.rent.delete({
      where: {
        id
      }
    })

    res.status(204).json(result)
  } catch (err) {
    console.log(err)
    res.status(500).json({ "error": "Houve um erro com o servidor" })
  }
})

router.get("/property", async (req, res) => {
  try {
    // @ts-ignore
    const ownerId = req.loggedUserId;

    const result = await prisma.property.findMany({
      where: {
        ownerId
      },
      include: {
        owner: true,
        rent: true,
        interests: true,
        favorited: true
      }
    })

    res.json(result)
  } catch (err) {
    console.log(err)
    res.status(500).json({ "error": "Houve um erro com o servidor" })
  }
})

router.get("/:id/property", async (req, res) => {
  try {
    // @ts-ignore
    const userId = req.loggedUserId;
    const id = parseInt(req.params.id)

    const result = await prisma.property.findUnique({
      where: {
        id
      },
      include: {
        owner: true,
        rent: true,
        interests: true,
        favorited: true
      }
    })

    checkIfSameUser(result.ownerId, userId, res)

    await prisma.property.update({
      where: {
        id
      },
      data: {
        viewed: {
          increment: 1,
        }
      }
    })

    res.json(result)
  } catch (err) {
    console.log(err)
    res.status(500).json({ "error": "Houve um erro com o servidor" })
  }
})

router.post("/property", async (req, res) => {
  try {
    // @ts-ignore
    const id = req.loggedUserId;

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
      isPetFriendly,
      isAdversiment,
      vacancyNumber
    } = req.body as unknown as {
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
      isPetFriendly: boolean,
      isAdversiment: boolean,
      vacancyNumber: number
    }

    const result = await prisma.property.create({
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
        isAdversiment,
        vacancyNumber,
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

router.patch("/:id/property", async (req, res) => {
  try {
    // @ts-ignore
    const userId = req.loggedUserId;
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
      isPetFriendly,
      isAdversiment,
      vacancyNumber
    } = req.body as unknown as {
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
      isPetFriendly: boolean,
      isAdversiment: boolean,
      vacancyNumber: number
    }

    const propertyResult = await prisma.property.findUnique({
      where: {
        id
      },
      include: {
        _count: {
          select: {
            rent: true
          }
        }
      }
    })

    checkIfSameUser(propertyResult.ownerId, userId, res)

    if (propertyResult._count.rent > vacancyNumber) res.status(404).json({ "error": "is not possible a vacancyNumber less than rents actives" })

    const result = await prisma.property.update({
      where: {
        id
      },
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
        isAdversiment,
        vacancyNumber
      }
    })

    res.json(result)
  } catch (err) {
    console.log(err)
    res.status(500).json({ "error": "Houve um erro com o servidor" })
  }
})

router.delete("/:id/property", async (req, res) => {
  try {
    // @ts-ignore
    const userId = req.loggedUserId;
    const id = parseInt(req.params.id)

    const propertyResult = await prisma.property.findUnique({
      where: {
        id
      }
    })

    checkIfSameUser(propertyResult.ownerId, userId, res)

    const deleteProperty = prisma.property.delete({
      where: {
        id
      }
    })

    const deleteRent = prisma.rent.deleteMany({
      where: {
        propertyId: id
      }
    })

    const deleteInterest = prisma.interest.deleteMany({
      where: {
        propertyId: id
      }
    })

    const transactional = await prisma.$transaction([deleteProperty, deleteRent, deleteInterest])
    res.status(204).json(transactional)

  } catch (err) {
    console.log(err)
    res.status(500).json({ "error": "Houve um erro com o servidor" })
  }
})

router.patch("/:id/interest", async (req, res) => {
  try {
    // @ts-ignore
    const propertyId = req.loggedUserId;
    const id = parseInt(req.params.id)
    const { pConfirmation } = req.body

    const query = await prisma.interest.findUnique({
      where: {
        id
      }
    })

    if (!query) res.status(404).json({ "error": "interest não encontrado" })
    checkIfSameUser(propertyId, query.propertyId, res)

    const result = await prisma.interest.update({
      where: {
        id
      },
      data: {
        pConfirmation
      }
    })

    const resultConfirmation = bothConfirmation(result)

    if (resultConfirmation)
      res.json(resultConfirmation)
    res.json(result)

  } catch (err) {
    console.log(err)
    res.status(500).json({ "error": "Houve um erro com o servidor" })
  }
})

export default router