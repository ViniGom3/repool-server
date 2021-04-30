import { Interest } from '@prisma/client'
import { prisma } from '../database'

export const checkIfSameUser = function (id, idLoggedUser, res) {
  if (id !== idLoggedUser) res.status(403).json({ "error": "Você não está autorizado a fazer essa operação" })
}

export const bothConfirmation = async function (result: Interest) {
  try {
    if (result.pConfirmation && result.uConfirmation) {
      const resultProperty = await prisma.property.findFirst({
        where: {
          id: result.propertyId
        },
        include: {
          _count: {
            select: {
              rent: true
            }
          }
        }
      })

      if (resultProperty.vacancyNumber > resultProperty._count.rent) {
        const createRent = prisma.rent.create({
          data: {
            guest: {
              connect: {
                id: result.userId
              }
            },
            property: {
              connect: {
                id: result.propertyId
              }
            }
          }
        })

        const deleteInterest = prisma.interest.deleteMany({
          where: {
            userId: result.userId
          }
        })

        const transactional = await prisma.$transaction([createRent, deleteInterest])
        return transactional
      }
      throw new Error()
    }
  } catch (error) {
    throw new Error()
  }
}