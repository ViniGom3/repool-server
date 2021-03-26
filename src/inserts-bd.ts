/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
// async function main() {
// ... you will write your Prisma Client queries here

// }

// eslint-disable-next-line @typescript-eslint/space-before-function-paren
async function main() {
  await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
      password: '12345678',
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
          ad: {
            create: {}
          }
        }
      },
      profile: {
        create: {
          bio: 'Eu adoro ter uma casa'
        }
      },
      tel: 25252525,
      cel: 252525252
    }
  })

  const allProperty = await prisma.property.findMany({})
  console.log(allProperty)
}
main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
