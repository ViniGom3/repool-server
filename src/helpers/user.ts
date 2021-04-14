import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jsonwebtoken from 'jsonwebtoken';

export const findEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    },
    select: {
      id: true
    }
  })
  return user
}

export const findByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })
  return user
}

export function verifyJWT(req, res, next) {
  const token = req.headers['authorization']

  if (!token) return res.status(401).json({ error: 'Nenhum token provido' });

  jsonwebtoken.verify(token, process.env.TOKEN_JWT, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).json({ error: 'Falha na autenticação' });
    } else {
      req.loggedUserId = parseInt(decoded.id)
      req.loggedUserRole = decoded.role
    }
  })
  next()
}

export const createJWT = async (id, role) => {
  return jsonwebtoken.sign({ id, role }, process.env.TOKEN_JWT, { expiresIn: "7d" })
}

export const parseBoolean = function (value: string) {
  return value ? Boolean(JSON.parse(value)) : undefined
}

export const handlePrice = function (value: string) {
  return value ? parseFloat(value) : undefined
}