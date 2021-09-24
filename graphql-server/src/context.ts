import { PrismaClient } from '@prisma/client'

export interface Context {
  req: any,
  prisma: PrismaClient
}

const prisma = new PrismaClient()

export const createContext = (req: any): Context => {
  return {
    ...req,
    prisma,

  }
}
