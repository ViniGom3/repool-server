import * as faker from 'faker'
import { PrismaClient, propertyCategory, userRole, userSex } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()

const user: userRole = "USER"
const owner: userRole = "OWNER"
const apart: propertyCategory = "APARTMENT"
const house: propertyCategory = "HOUSE"
const male: userSex = "MALE"
const female: userSex = "FEMALE"

const hashing = async function (value: string) {
  return await argon2.hash(value)
}



const users = Array.from({ length: 25 }).map((v, i) => ({
  name: faker.name.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  avatar: faker.image.avatar(),
  role: i < 25 ? user : owner,
  bio: faker.lorem.sentence(),
  sex: i < 25 ? male : female,
  tel: faker.phone.phoneNumberFormat(),
  cel: faker.phone.phoneNumberFormat()
}))

const properties = Array.from({ length: 25 }).map((v, i) => ({
  ownerId: i + 1,
  name: faker.name.firstName(),
  description: faker.lorem.paragraph(),
  img: faker.image.imageUrl(),
  category: i < 25 ? apart : house,
  cep: faker.address.zipCodeByState(),
  street: faker.address.streetName(),
  neighborhood: faker.address.county(),
  city: faker.address.cityName(),
  uf: faker.address.stateAbbr(),
  country: faker.address.countryCode(),
  number: `${Math.floor(Math.random() * 100)}`,
  complement: faker.address.secondaryAddress(),
  vacancyPrice: parseFloat(faker.commerce.price()),
  hasGarage: true,
  hasGourmet: true,
  hasInternet: true,
  isPetFriendly: true,
  isAdvertisement: true,
  vacancyNumber: Math.floor(Math.random() * (i - 1) + 1),
  viewed: Math.floor(Math.random() * (i - 0) + 0),
}))

const rents = Array.from({ length: 25 }).map((v, i) => ({
  value: Math.floor(Math.random() * (5 - 1) + 1),
  comment: faker.lorem.paragraph(),
  isActive: i < 25 ? false : true,
  guestId: 25 - i,
  propertyId: i + 1
}))

const interests = Array.from({ length: 25 }).map((v, i) => ({
  uConfirmation: i < 25 ? false : true,
  pConfirmation: i < 25 ? false : true,
  userId: 25 - i,
  propertyId: i + 1
}))


async function main() {
  const hash = await hashing(process.env.ADMIN_PASSWORD)

  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@repool.com.br',
      password: hash,
      role: 'ADMIN',
      avatar: faker.image.avatar(),
      bio: "Olá, sou o Administrador do sistema Repool. Aqui você pode escolher uma república, um lugar que deseja viver durante sua fase como estudante universitário, bom um preço baixo e na qualidade que desejar",
      tel: "xxxx-xxxx",
      cel: "yyyy-yyyy"
    }
  })

  await prisma.user.createMany({
    data: users
  })

  await prisma.property.createMany({
    data: properties
  })

  await prisma.interest.createMany({
    data: interests
  })

  await prisma.rent.createMany({
    data: rents
  })
}

main().catch((e) => {
  console.log(e)
  process.exit(1)
}).finally(() => {
  prisma.$disconnect()
})

// property: {
//   create: {
//     name: 'Casa verde',
//     description: 'Uma casa muito verde',
//     img: 'https://i.pinimg.com/564x/0b/a0/a7/0ba0a7778e66f8605d41d3ba50846f3d.jpg',
//     category: 'HOUSE',
//     cep: '22222222',
//     street: 'rua das ruas',
//     neighborhood: 'bairro',
//     city: 'cidade',
//     uf: 'rj',
//     country: 'br',
//     number:
//     complement: 
//     vacancyPrice: 555.0,
//     hasGarage: true,
//     hasGourmet: true,
//     hasInternet: true,
//     isPetFriendly: true,
//     isAdvertisement: true,
//   }