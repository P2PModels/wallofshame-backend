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
import { DateTimeResolver } from 'graphql-scalars'
import { ethers } from "ethers";

import BadgeContract from './blockchain-service/abis/Badge.json' 

require('dotenv').config();

export const DateTime = asNexusMethod(DateTimeResolver, 'date')

const Badge = objectType({
  name: 'Badge',
  definition(t) {
    t.nonNull.string('id')
    t.string('issuerName')
    t.string('recipientName')
    t.string('area')
    t.field('issueDate', {type: 'DateTime'})
    t.field('txReceipt', {
      type: 'TxReceipt',
      resolve: (parent, _, context) => {
        return context.prisma.txReceipt
          .findUnique({
            where: { badgeId: parent.id || undefined },
          })
      },
    })
  },
})

const BadgeCreateInput = inputObjectType({
  name: 'BadgeCreateInput',
  definition(t) {
    // t.nonNull.string('id')
    t.string('issuerName')
    t.string('recipientName')
    t.string('area')
    t.field('issueDate', {type: 'DateTime'})
    t.field('txReceipt', { type: 'TxReceiptCreateInput' })
  },
})

const TxReceipt = objectType({
  name: 'TxReceipt',
  definition(t) {
    t.nonNull.string('id')
    t.string('to')
    t.string('from')
    t.string('contractAdress')
    t.field('badge', {
      type: 'Badge',
      resolve: (parent, _, context) => {
        return context.prisma.badge
          .findUnique({
            where: { id: parent.badgeId || undefined },
          })
      },
    })
    t.string('badgeId')
  },
})
// TODO
const TxReceiptCreateInput = inputObjectType({
  name: 'TxReceiptCreateInput',
  definition(t) {
    // t.nonNull.string('id')
    t.string('to')
    t.string('from')
    t.string('contractAdress')
    t.field('badge', { type: 'BadgeCreateInput' })
    t.string('badgeId')
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
    // Badge queries
    t.nonNull.list.nonNull.field('allBadges', {
      type: 'Badge',
      resolve: (_parent, _args, context) => {
        return context.prisma.badge.findMany()
      },
    })

    t.nullable.field('badgeById', {
      type: 'Badge',
      args: {
        id: stringArg(),
      },
      resolve: (_parent, args, context) => {
        return context.prisma.badge.findUnique({
          where: { id: args.id || undefined },
        })
      },
    })

    // TODO
    t.nonNull.list.nonNull.field('feed', {
      type: 'Badge',
      args: {
        skip: intArg(),
        take: intArg(),
        orderBy: arg({
          type: 'BadgeOrderByDate',
        }),
      },
      resolve: (_parent, args, context) => {
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
    // Badge mutations
    // TODO: Review, flatten data object¿?
    t.nonNull.field('addBadge', {
      type: 'Badge',
      args: {
        data: nonNull(
          arg({
            type: 'BadgeCreateInput',
          }),
        ),
      },
      resolve: (_, args, context) => {
        return context.prisma.badge.create({
          data: {
            issuerName: args.data.issuerName || '',
            recipientName: args.data.recipientName || '',
            area: args.data.area,
            issueDate: args.data.issueDate || new Date(),
          },
        })
      },
    })

    t.nonNull.field('issueBadge', {
      type: 'Badge',
      args: {
        data: nonNull(
          arg({
            type: 'BadgeCreateInput',
          }),
        ),
      },
      // TODO: Async or pass a promise to client ¿?
      resolve: async (_, args, context) => {
        // TODO: Provide our Infura project url
        const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_ENDPOINT)
        // console.log(`<issuBadge> Provider: ${provider}`)
        // console.log(provider)


        // TODO: Create wallet and connect to provider
        const signer = new ethers.Wallet(process.env.ORGANIZATION_PRIVATE_KEY, provider)
        // console.log(`<issuBadge> Wallet: ${signer}`)
        // console.log(signer)

        // TODO: Import contract info
        const badgeIssuerInstance = new ethers.Contract(
            BadgeContract.address,
            BadgeContract.abi,
            signer
        )

        let receipt
        try {
            const txResponse = await badgeIssuerInstance.issue(
              args.data.issuerName,
              // TODO: badge recipient address, remove for demand use case
              '0x05eC46AeBA9Ed0bfC7318bA950977a22386A3fc2',
              args.data.recipientName || 'P2PModels',
            )
            // console.log(`<issuBadge> Tx sent, txResponse: ${txResponse}`)
            // console.log(txResponse)
            receipt = await txResponse.wait()
            console.log(`<issuBadge> Tx receipt`)
            console.log(receipt)

        } catch (e) {
            console.log(`<issuBadge> Error sendig tx:`)
            console.error(e)
        }

        return context.prisma.badge.create({
          data: {
            issuerName: args.data.issuerName || '',
            recipientName: args.data.recipientName || '',
            area: args.data.area,
            issueDate: args.data.issueDate || new Date(),
            txReceipt: { 
              create: {
                to: receipt.to || '',
                from: receipt.from || '',
                contractAdress: receipt.contractAdress || '',
              },
            },
          },
        })
      },
    })
  },
})

export const schema = makeSchema({
  types: [
    DateTime,
    SortOrder,
    Badge,
    BadgeCreateInput,
    BadgeOrderByDate,
    TxReceipt,
    TxReceiptCreateInput,
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
