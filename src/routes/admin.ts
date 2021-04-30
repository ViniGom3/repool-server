import { Router } from 'express'
import { prisma } from '../database'
import { handleDateAgo } from '../helpers'

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
  try {
    const today = new Date()
    const thirtyDaysAgo = handleDateAgo(today)

    const all = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

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
        sex: "FEMALE",
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    const unknow = await prisma.user.count({
      where: {
        sex: "NOTKNOW",
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    const notapplicable = await prisma.user.count({
      where: {
        sex: "NOTAPPLICABLE",
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    const countSex = { all, men, women, unknow, notapplicable }
    res.json(countSex)
  } catch (error) {
    console.log(error)
    res.status(500).json({ "error": "Houve um erro com o servidor" })
  }
})

export default router