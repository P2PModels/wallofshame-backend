import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    email: 'info@p2pmodels.eu',
    terms: true,
    region: 'madrid',
    profession: 'artes_escenicas',
    gender: 'femenino'
  },
  {
    email: 'test@testing.eu',
    terms: true,
    region: 'barcelona',
    profession: 'fotografia',
    gender: 'no_binario'
  },
  // {
  //   email: 'info@p2pmodels.eu',
  //   name: 'p2pmodels',
  //   password: '$2a$10$k2rXCFgdmO84Vhkyb6trJ.oH6MYLf141uTPf81w04BImKVqDbBivi', // random42
  // },
  // {
  //   email: 'luishercep@gmail.com',
  //   name: 'luishporras',
  //   password: '$2a$10$lTlNdIBQvCho0BoQg21KWu/VVKwlYsGwAa5r7ctOV41EKXRQ31ING', // iLikeTurtles42
  // },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u
    })
    console.log(`Created user with id: ${user.id}`)
    // console.log(`Credentials: \n name: ${user.name} \n password: ${user.password}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })