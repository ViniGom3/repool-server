import { Router } from 'express'
import { PrismaPromise } from '@prisma/client'
import { prisma } from '../database'
import { bothConfirmation, checkIfSameUser, createJWT, handlePrice, handleValue, parseBoolean } from '../helpers'
import { upload } from '../middlewares/multer'
import { Property } from '../classes'

const router = Router()


export default router