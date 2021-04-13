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



export default router