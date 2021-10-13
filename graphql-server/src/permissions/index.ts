import { rule, shield } from 'graphql-shield'
import { getUserId, isConnected, isAdmin } from '../utils'
import { Context } from '../context'

const rules = {
  isAuthenticatedUser: rule()( async (_parent, _args, context: Context) => {
    // Get id from token
    const userId = getUserId(context)
    // Check the user is currently connected
    const connected = await isConnected(userId, context)
    return Boolean(connected)
  }),
  isAdminUser: rule()( async (_parent, _args, context: Context) => {
    // Get id from token
    const userId = getUserId(context)
    // Check the user is currently connected
    const connected = await isConnected(userId, context)
    if(!connected) return false  
    // Check the user has an admin role
    const admin = await isAdmin(userId, context)
    return Boolean(admin)
  }),
}

export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
    allUsers: rules.isAdminUser,
  },
})