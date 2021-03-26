import { Router } from 'express'

const router = Router()

router.get("/owners", (req, res) => {
  res.json({
    "hi": "hello ois"
  })
})

router.get("/ownerss", (req, res) => {
  res.json({
    "hi": "hello saddois"
  })
})

export default router