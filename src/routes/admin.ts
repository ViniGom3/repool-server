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

router.get('/properties', async (req, res) => {
  try {
    const all = await prisma.property.count()

    const propertiesInRj = await prisma.property.count({ where: { uf: 'RJ' } })
    const propertiesInMg = await prisma.property.count({ where: { uf: 'MG' } })
    const propertiesInSp = await prisma.property.count({ where: { uf: 'SP' } })
    const propertiesInEs = await prisma.property.count({ where: { uf: 'ES' } })

    const countProperty = { all, propertiesInRj, propertiesInMg, propertiesInSp, propertiesInEs }
    res.json(countProperty)
  } catch (error) {
    console.log(error)
    res.status(500).json({ "error": "Houve um erro com o servidor" })
  }
})

router.get('/properties-mounth', async (req, res) => {
  try {
    const today = new Date()
    const thirtyDaysAgo = handleDateAgo(today)

    const all = await prisma.property.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    const propertiesInRj = await prisma.property.count({
      where: {
        uf: 'RJ',
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })
    const propertiesInMg = await prisma.property.count({
      where: {
        uf: 'MG',
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })
    const propertiesInSp = await prisma.property.count({
      where: {
        uf: 'SP',
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })
    const propertiesInEs = await prisma.property.count({
      where: {
        uf: 'ES',
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    const countProperty = { all, propertiesInRj, propertiesInMg, propertiesInSp, propertiesInEs }
    res.json(countProperty)
  } catch (error) {
    console.log(error)
    res.status(500).json({ "error": "Houve um erro com o servidor" })
  }
})

export default router