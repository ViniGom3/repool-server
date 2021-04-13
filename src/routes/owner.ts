import { Router } from 'express'
import { PrismaClient, propertyCategory } from '@prisma/client'
import { bothConfirmation, checkIfSameUser } from '../helpers/subscribers'

const prisma = new PrismaClient()
const router = Router()



export default router