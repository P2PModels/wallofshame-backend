import {
  makeSchema,
  nonNull,
  objectType,
  inputObjectType,
  arg,
} from 'nexus'
import { ethers } from "ethers";
import { ExternallyOwnedAccount } from "@ethersproject/abstract-signer";

import CaseRegistryContract from './report-service/abis/CaseRegistry.json' 

require('dotenv').config();

const Case = objectType({
  name: 'Case',
  definition(t) {
    t.nonNull.string('id'),
    t.string('companyName'),
    t.string('caseType'),
    t.string('description'),
    t.string('region'),
    t.string('profession'),
    t.string('gender'),
    t.string('ageRange'),
    t.string('experience')
  },
})

const ReportCaseCreateInput = inputObjectType({
  name: 'ReportCaseCreateInput',
  definition(t) {
    t.string('companyName'),
    t.string('caseType'),
    t.string('description'),
    t.string('region'),
    t.string('profession'),
    t.string('gender'),
    t.string('ageRange'),
    t.string('experience')
  },
})

const Connection = objectType({
  name: 'Connection',
  definition(t) {
    t.boolean('connected')
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.nonNull.field('report', {
      type: 'Case',
      args: {
        data: nonNull(
          arg({
            type: 'ReportCaseCreateInput',
          }),
        ),
      },
      resolve: async (_, args, context) => {

        console.log("Reporting new case...")

        // Provide Infura project url
        const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_ENDPOINT)


        // Provide wallet data and connect to provider
        const eoa: ExternallyOwnedAccount = { 
          address: process.env.ORGANIZATION_PUBLIC_ADDRESS || '',
          privateKey: process.env.ORGANIZATION_PRIVATE_KEY || '' 
        }
        const signer = new ethers.Wallet(eoa, provider)

        // Import contract info
        const caseRegistryInstance = new ethers.Contract(
            CaseRegistryContract.address,
            CaseRegistryContract.abi,
            signer
        )

        let receipt
        try {
            const txResponse = await caseRegistryInstance.report(
              args.data.companyName,
              args.data.caseType,
              args.data.description,
              args.data.region,
              args.data.profession,
              args.data.gender,
              args.data.ageRange,
              args.data.experience
            )
            console.log(txResponse)
            receipt = await txResponse.wait()
            console.log(receipt)
        } catch (e) {
            console.error(e)
        }

        return ({
            id: "0",
            companyName:  args.data.companyName,
            caseType:  args.data.caseType,
            description:  args.data.description,
            region:  args.data.region,
            profession:  args.data.profession,
            gender:  args.data.gender,
            ageRange:  args.data.ageRange,
            experience:  args.data.experience 
        })
      },
    })

    t.nonNull.field('restart', {
      type: 'Connection',
      resolve: async (_,args,context) => {
        // Provide Infura project url
        const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_ENDPOINT)
    
        // Provide wallet data and connect to provider
        const eoa: ExternallyOwnedAccount = { 
          address: process.env.ORGANIZATION_PUBLIC_ADDRESS || '',
          privateKey: process.env.ORGANIZATION_PRIVATE_KEY || '' 
        }
        const signer = new ethers.Wallet(eoa, provider)

        // Import contract info
        const caseRegistryInstance = new ethers.Contract(
            CaseRegistryContract.address,
            CaseRegistryContract.abi,
            signer
        )

        let receipt
        try {
            const txResponse = await caseRegistryInstance.restart()
            receipt = await txResponse.wait()
        } catch (e) {
            console.error(e)
            return { connected: false }
        }

        return { connected: true }
      }
    })
  },
})

export const schema = makeSchema({
  types: [
    Case,
    ReportCaseCreateInput,
    Connection,
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
