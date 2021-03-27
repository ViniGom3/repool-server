import { Express, Router } from 'express'
import Users from './routes/users'
import Subscriber from './routes/subscriber'
import { verifyJWT } from './helpers/user'

export default (app: Express): void => {
  const router = Router()

  app.use('/user', Users)

  app.use(verifyJWT)
  app.use('/subscriber', Subscriber)

}
