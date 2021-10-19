import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const badgeData: any[] = [
  {
    issuerName: "Juan Pérez",
    recipientName: "Nestlé Inc.",
    area: "Diseño gráfico",
    issueDate: new Date(),
    txReceipt: {
      to: "0x05eC46AeBA9Ed0bfC7318bA950977a22386A3fc2",
      from: "0xb4124cEB3451635DAcedd11767f004d8a28c6eE7",
      contractAdress: "0xf772617a46D7a21bEA2a2B9D59A6d624A2013f40",
    } 
  },
  {
    issuerName: "Jimena Estevez",
    recipientName: "Ecologistas en acción",
    area: "Comunicación",
    issueDate: new Date(),
    txReceipt: {
      to: "0x05eC46AeBA9Ed0bfC7318bA950977a22386A3fc2",
      from: "0xb4124cEB3451635DAcedd11767f004d8a28c6eE7",
      contractAdress: "0xf772617a46D7a21bEA2a2B9D59A6d624A2013f40",
    }
  },
  {
    issuerName: "Red de Redes de Economía Alternativa y Solidaria",
    recipientName: "Germinando Coop.",
    area: "Emprendimiento Agroecológico",
    issueDate: new Date(),
    txReceipt: {
      to: "0x05eC46AeBA9Ed0bfC7318bA950977a22386A3fc2",
      from: "0xb4124cEB3451635DAcedd11767f004d8a28c6eE7",
      contractAdress: "0xf772617a46D7a21bEA2a2B9D59A6d624A2013f40",
    }
  },
]


async function main() {
  console.log(`Start seeding ...`)

  for (const b of badgeData) {
    const badge = await prisma.badge.create({
      data: {
        issuerName: b.issuerName,
        recipientName: b.recipientName,
        area: b.area,
        issueDate: b.issueDate,
        txReceipt: {
          create: {
            to: b.txReceipt.to,
            from: b.txReceipt.from,
            contractAdress: b.txReceipt.contractAdress,
          }
        }
      }
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