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
    },
    include: {
      profile: true
    },

  })
  return user
}

export function verifyJWT(req, res, next) {
  const token = req.headers['authorization']

  if (!token) return res.status(401).json({ error: 'Nenhum token provido' });

  jsonwebtoken.verify(token, process.env.TOKEN_JWT, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: 'Falha na autenticação' });
    } else {
      req.loggedUserId = decoded.id
    }
  })
  next()
}

export const createJWT = async (id) => {
  return jsonwebtoken.sign({ id }, process.env.TOKEN_JWT, { expiresIn: "7d" })
}


