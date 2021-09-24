import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import {
  intArg,
  makeSchema,
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  arg,
  asNexusMethod,
  enumType,
} from 'nexus'
import { applyMiddleware } from 'graphql-middleware'
import { DateTimeResolver } from 'graphql-scalars'
import { v4 as uuid } from 'uuid';

import { permissions } from './permissions'
import { Context } from './context'
import { APP_SECRET, getUserId } from './utils'

export const DateTime = asNexusMethod(DateTimeResolver, 'date')

const Role = enumType({
  name: 'Role',
  members: ['ADMIN', 'USER'],
})

const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('email')
    t.string('name')
    t.string('password')
    t.field('role', { type: 'Role' })
  },
})

const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  definition(t) {
    t.nonNull.string('email')
    t.string('name')
    t.nonNull.string('password')
  },
})

const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token')
    t.field('user', { type: 'User' })
  },
})

const Badge = objectType({
  name: 'Badge',
  definition(t) {
    t.nonNull.string('id')
    t.string('issuerName')
    t.string('recipientName')
    t.string('area')
    t.field('issueDate', {type: 'DateTime'})
  },
})

const BadgeCreateInput = inputObjectType({
  name: 'BadgeCreateInput',
  definition(t) {
    t.nonNull.string('id')
    t.string('issuerName')
    t.string('recipientName')
    t.string('area')
    t.field('issueDate', {type: 'DateTime'})
  },
})

const SortOrder = enumType({
  name: 'SortOrder',
  members: ['asc', 'desc'],
})

const BadgeOrderByDate = inputObjectType({
  name: 'BadgeOrderByDate',
  definition(t) {
    t.nonNull.field('issueDate', { type: 'SortOrder' })
  },
})

const Query = objectType({
  name: 'Query',
  definition(t) {
    // User queries
    // TODO
    t.nonNull.list.nonNull.field('allUsers', {
      type: 'User',
      resolve: (_parent, _args, context: Context) => {
        // if(!context.user || context.user !== 'ADMIN') return null
        return context.prisma.user.findMany()
      },
    })

    t.nullable.field('userById', {
      type: 'User',
      args: {
        id: stringArg(),
      },
      resolve: (_parent, args, context: Context) => {
        return context.prisma.user.findUnique({
          where: { id: args.id || undefined },
        })
      },
    })

    t.nullable.field('me', {
      type: 'User',
      resolve: (parent, args, context: Context) => {
        // Check auth and get id
        const userId = getUserId(context)
        console.log("Resolver called getUserId")
        console.log(userId)
        return context.prisma.user.findUnique({
          where: {
            id: userId,
          },
        })
      },
    })

    // Badge queries
    t.nonNull.list.nonNull.field('allBadges', {
      type: 'Badge',
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.badge.findMany()
      },
    })

    t.nullable.field('badgeById', {
      type: 'Badge',
      args: {
        id: stringArg(),
      },
      resolve: (_parent, args, context: Context) => {
        return context.prisma.badge.findUnique({
          where: { id: args.id || undefined },
        })
      },
    })

    t.nonNull.list.nonNull.field('feed', {
      type: 'Badge',
      args: {
        skip: intArg(),
        take: intArg(),
        orderBy: arg({
          type: 'BadgeOrderByDate',
        }),
      },
      resolve: (_parent, args, context: Context) => {
        return context.prisma.badge.findMany({
          take: args.take || undefined,
          skip: args.skip || undefined,
          orderBy: args.orderBy,
        })
      },
    })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {

    // User mutations
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        name: stringArg(),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, args, context: Context) => {
        console.log("Trying to signup")
        const hashedPassword = await hash(args.password, 10)
        console.log("Password hashed")

        const user = await context.prisma.user.create({
          data: {
            name: args.name,
            email: args.email,
            password: hashedPassword,
          },
        })
        console.log("User created")

        console.log(APP_SECRET)
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, { email, password }, context: Context) => {
        const user = await context.prisma.user.findUnique({
          where: {
            email,
          },
        })
        if (!user) {
          throw new Error(`No user found for email: ${email}`)
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error('Invalid password')
        }
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('setAdmin', {
      type: 'User',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_parent, { id }, context: Context) => {
        try {
          const user = await context.prisma.user.findUnique({
            where: {
              id,
            },
          })
          return context.prisma.user.update({
            where: { id: id },
            data: { role: 'ADMIN' },
          })
        } catch (e) {
          throw new Error(
            `No user found in database`,
          )
        }
      },
    })

    // Badge mutations
    // TODO: Review, flatten data object¿?, nativa PostgresQL uuid function?
    t.nonNull.field('addBadge', {
      type: 'Badge',
      args: {
        data: nonNull(
          arg({
            type: 'BadgeCreateInput',
          }),
        ),
      },
      resolve: (_, args, context: Context) => {
        return context.prisma.badge.create({
          data: {
            // id: uuid(),
            issuerName: args.data.issuerName || '',
            recipientName: args.data.recipientName || '',
            area: args.data.area,
            issueDate: args.data.issueDate || new Date(),
          },
        })
      },
    })
  },
})

const schemaWithoutPermissions = makeSchema({
  types: [
    DateTime,
    Role,
    SortOrder,
    User,
    UserCreateInput,
    AuthPayload,
    Badge,
    BadgeCreateInput,
    BadgeOrderByDate,
    Query,
    Mutation,
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})

export const schema = applyMiddleware(schemaWithoutPermissions, permissions)
