import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import argon2 from 'argon2'

async function main() {

  const hash = await argon2.hash(process.env.ADMIN_PASSWORD);

  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@repool.com.br',
      password: hash,
      role: 'ADMIN',
      property: {
        create: {
          name: 'Casa verde',
          description: 'Uma casa muito verde',
          img: 'https://i.pinimg.com/564x/0b/a0/a7/0ba0a7778e66f8605d41d3ba50846f3d.jpg',
          type: 'casa',
          cep: '22222222',
          street: 'rua das ruas',
          neighborhood: 'bairro',
          city: 'cidade',
          uf: 'rj',
          country: 'br',
          vacancyPrice: 555.0,
          hasGarage: true,
          ad: {
            create: {}
          }
        }
      },
      profile: {
        create: {
          bio: 'Administrador geral'
        }
      },
      tel: "xxxxxxxx",
      cel: "xxxxxxxxx"
    }
  })

  const result = await prisma.user.findMany({})
  console.log(result)
}
main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
