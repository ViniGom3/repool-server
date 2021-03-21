import { Express, Router } from 'express'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)

  router.get('/hw', (req, res, next) => {
    res.send('hello world')
  })
}
