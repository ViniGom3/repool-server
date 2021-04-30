import { Router } from 'express'
import { prisma } from '../database'

const router = Router()

router.get('/sex', async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error)
    res.status(500).json({ "error": "Houve um erro com o servidor" })
  }
})

export default router