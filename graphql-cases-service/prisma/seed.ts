import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const reportCaseData: any[] = [
  {
    companyName: "Ibertrola",
    caseType: "Maltrato",  
    description: "En mi puesto de trabajo mi jefe me trataba de forma vejatoria, mis compañeros me hacían moving. Tras unos meses dejé mi puesto de trabajo.",   
    region: "Madrid",        
    profession: "Arquitecto",  
    gender: "Masculino",   
    ageRange: "25-35",    
    experience: "2-5años",   
  },
]


async function main() {
  console.log(`Start seeding ...`)

  for (const c of reportCaseData) {
    // const caseToReport = await prisma.case.create({
    //   data: {
    //     companyName: c.companyName,
    //     caseType: c.caseType,  
    //     description: c.description,   
    //     region: c.region,        
    //     profession: c.profession,  
    //     gender: c.gender,   
    //     ageRange: c.ageRange,    
    //     experience: c.experience, 
    //   }
    // })
    // console.log(`Created case with id: ${caseToReport.id}`)
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