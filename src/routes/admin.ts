import { Router } from 'express'
import { prisma } from '../database'

const router = Router()

router.get('/sex', async (req, res) => {
  try {

    const all = await prisma.user.count()

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

    const countSex = { all, men, women, unknow, notapplicable }
    res.json(countSex)
  } catch (error) {
    console.log(error)
    res.status(500).json({ "error": "Houve um erro com o servidor" })
  }
})

router.get('/sex-mounth', async (req, res) => {

  const today = new Date()
  const DAYS_AGO = 30
  const thirtyDaysAgoInSeconds = new Date().setDate(today.getDate() - DAYS_AGO)
  const thirtyDaysAgo = new Date(thirtyDaysAgoInSeconds)

  const men = await prisma.user.count({
    where: {
      sex: "MALE",
      createdAt: {
        gte: thirtyDaysAgo
      }
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