import { Express, Router } from 'express'
import Users from './routes/users'

export default (app: Express): void => {
  const router = Router()

  app.use('/owner', Users)

}
