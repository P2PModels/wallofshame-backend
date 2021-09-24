import { PrismaClient, Prisma } from '@prisma/client'
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient()

const date = new Date().toString()

const userData: Prisma.UserCreateInput[] = [
  {
    email: 'info@p2pmodels.eu',
    name: 'p2pmodels',
    password: '$2a$10$k2rXCFgdmO84Vhkyb6trJ.oH6MYLf141uTPf81w04BImKVqDbBivi', // random42
  },
  {
    email: 'luishercep@gmail.com',
    name: 'luishporras',
    password: '$2a$10$lTlNdIBQvCho0BoQg21KWu/VVKwlYsGwAa5r7ctOV41EKXRQ31ING', // iLikeTurtles42
  },
]

const badgeData: Prisma.BadgeCreateInput[] = [
  {
    id: uuid(),
    issuerName: "Juan Pérez",
    recipientName: "Nestlé Inc.",
    area: "Diseño gráfico",
    issueDate: new Date()
  },
  {
    id: uuid(),
    issuerName: "Jimena Estevez",
    recipientName: "Ecologistas en acción",
    area: "Comunicación",
    issueDate: new Date()
  },
  {
    id: uuid(),
    issuerName: "Red de Redes de Economía Alternativa y Solidaria",
    recipientName: "Germinando Coop.",
    area: "Emprendimiento Agroecológico",
    issueDate: new Date()
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u
    })
    console.log(`Created user with id: ${user.id}`)
    console.log(`Credentials: \n name: ${user.name} \n password: ${user.password}`)
  }
  
  for (const b of badgeData) {
    const badge = await prisma.badge.create({
      data: b,
    })
    console.log(`Created badge with id: ${badge.id}`)
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