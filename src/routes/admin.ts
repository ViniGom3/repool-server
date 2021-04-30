import { Router } from 'express'
import { PrismaPromise } from '@prisma/client'
import { prisma } from '../database'
import { bothConfirmation, checkIfSameUser, createJWT, handlePrice, handleValue, parseBoolean } from '../helpers'
import { upload } from '../middlewares/multer'
import { Property } from '../classes'

const router = Router()

router.get('/sex', async (req, res) => {

  const men = await prisma.user.count({
    where: {
      sex: "MALE"
    }
  })

  const women = await prisma.user.count({
    where: {
      sex: "FEMALE"
    }
  })

  const unknow = await prisma.user.count({
    where: {
      sex: "NOTKNOW"
    }
  })

  const notapplicable = await prisma.user.count({
    where: {
      sex: 'NOTAPPLICABLE'
    }
  })

  const countSex = { men, women, unknow, notapplicable }
  res.json(countSex)
})

export default router