import { verify } from 'jsonwebtoken'
import { Context } from './context'

require('dotenv').config();

export const APP_SECRET = process.env.APP_SECRET

interface Token {
  userId: string
}

export function getUserId(context: Context) {
  const authHeader = context.req.get('Authorization')
  if (authHeader) {
    const token = authHeader.replace('Commons ', '')
    const verifiedToken = verify(token, APP_SECRET) as Token
    return verifiedToken && String(verifiedToken.userId) // Return userId if exists
  }
}

export async function isConnected(id: string | undefined, context: Context) {
  const user = await context.prisma.user.findUnique({
    where: { id: id },
  })
  return Boolean(user?.connected)
}

export async function isAdmin(id: string | undefined, context: Context) {
  const user = await context.prisma.user.findUnique({
    where: { id: id },
  })
  return Boolean(user?.role === 'ADMIN')
}
