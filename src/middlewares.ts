import { Express } from 'express'
import { bodyParser } from './middlewares/bodyparser'
import { cors } from './middlewares/cors'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
}
