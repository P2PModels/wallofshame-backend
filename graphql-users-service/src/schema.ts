import {
  makeSchema,
  nonNull,
  objectType,
  inputObjectType,
  arg,
} from 'nexus'

const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('email')
    t.nonNull.boolean('terms')
    t.nonNull.string('region')
    t.nonNull.string('profession')
    t.nonNull.string('gender')
  },
})

const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  definition(t) {
    t.nonNull.string('email')
    t.nonNull.boolean('terms')
    t.nonNull.string('region')
    t.nonNull.string('profession')
    t.nonNull.string('gender')
  },
})

const UserWhereInput = inputObjectType({
  name: 'UserWhereInput',
  definition(t) {
    t.string('email')
    t.boolean('terms')
    t.string('region')
    t.string('profession')
    t.string('gender')
  },
})

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('users', {
      type: 'User',
      args: {
        filter: arg({
          type: 'String',
        }),
      },
      resolve: (_parent, args, context) => {
        return context.prisma.user.findMany({
          where: args.filter ? JSON.parse(args.filter) : undefined
        })
      },
    })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {

    t.field('add', {
      type: 'User',
      args: {
        data: nonNull(
          arg({
            type: 'UserCreateInput',
          })
        ),
      },
      resolve: async (_parent, args, context) => {
        console.log(args);
        return (context.prisma.user.create({
          data: {
            email: args.data.email,
            terms: args.data.terms,
            region: args.data.region,
            profession: args.data.profession,
            gender: args.data.gender,
          },
        }))
      },
    })

    t.field('deleteUsers', {
      type: 'Boolean',
      resolve: async (_, args, context) => {
        console.log("Clear users")
        let deleted = await context.prisma.user.deleteMany({})
        return !!deleted
      },
    })

  },
})

export const schema = makeSchema({
  types: [
    User,
    UserCreateInput,
    UserWhereInput,
    Query,
    Mutation,
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
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


