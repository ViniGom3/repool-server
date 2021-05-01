import { Interest } from '@prisma/client'
import { Property } from '../classes'
import { prisma } from '../database'

export const checkIfSameUser = function (id, idLoggedUser, res) {
  if (id !== idLoggedUser) res.status(403).json({ "error": "Você não está autorizado a fazer essa operação" })
}

export const bothConfirmation = async function (result: Interest) {
  try {
    if (result.pConfirmation && result.uConfirmation) {
      const resultProperty: Property = await prisma.property.findUnique({
        where: {
          id: result.propertyId
        }
      })

      const countActiveRentsOnProperty: number = await prisma.rent.count({
        where: {
          propertyId: result.propertyId,
          isActive: true
        }
      })

      if (resultProperty.vacancyNumber > countActiveRentsOnProperty) {
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