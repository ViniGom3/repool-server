import { Interest, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const checkIfSameUser = function (id, idLoggedUser, res) {
  if (id !== idLoggedUser) res.status(403).json({ "error": "Você não está autorizado a fazer essa operação" })
}

export const bothConfirmation = async function (result: Interest) {
  if (result.pConfirmation && result.uConfirmation) {
    const resultProperty = await prisma.property.findFirst({
      where: {
        id: result.propertyId
      }
    })

    //TEM QUE FAZER UM COUNT NO NUMERO DE RENTS E CHECAR

    if (resultProperty.vacancyNumber > 0) {
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
          id: result.userId
        }
      })
      const transactional = await prisma.$transaction([createRent, deleteInterest])
      return transactional
    }

  }
}