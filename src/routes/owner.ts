import { Router } from 'express'
import { PrismaClient, propertyCategory } from '@prisma/client'
import { bothConfirmation, checkIfSameUser } from '../helpers/subscribers'

const prisma = new PrismaClient()
const router = Router()

router.get("/interests", async (req, res) => {
  // @ts-ignore
  const propertyId = req.loggedUserId;

  const result = await prisma.interest.findMany({
    where: {
      propertyId
    },
    include: {
      Property: true,
      User: true
    }
  })

  res.json(result)
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
      isAdversiment
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
      isAdversiment: boolean
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
    isAdversiment
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
    isAdversiment: boolean
  }

  const propertyResult = await prisma.property.findFirst({
    where: {
      ownerId: userId
    }
  })

  checkIfSameUser(propertyResult.ownerId, userId, res)

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
      isAdversiment
    }
  })

  res.json(result)
})



export default router