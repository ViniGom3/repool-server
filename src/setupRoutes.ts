import { Express, Router } from 'express'
import Users from './routes/users'
import Subscribers from './routes/subscriber'
import Owners from './routes/owner'
import { verifyJWT } from './helpers/user'
import { verifyRole } from './helpers/owner'

export default (app: Express): void => {
  const router = Router()

  app.use('/user', Users)

  app.use(verifyJWT)
  app.use('/subscriber', Subscribers)

  app.use(verifyRole)

  app.use('/owner', Owners)

}
