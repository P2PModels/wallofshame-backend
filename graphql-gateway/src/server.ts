import { introspectSchema } from '@graphql-tools/wrap'
import { stitchSchemas } from '@graphql-tools/stitch'
import { ApolloServer } from 'apollo-server'
import makeRemoteExecutor from './utils/makeRemoteExecutor'
import {
  ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";

async function makeGatewaySchema() {
  const usersRemoteExecutor = makeRemoteExecutor(
    'http://localhost:4001/'
  )
  const blockchainRemoteExecutor = makeRemoteExecutor(
    'http://localhost:4002/'
  )
  const adminContext = { authHeader: 'Commons my-app-to-app-token' };

  return stitchSchemas({
    subschemas: [
      {
        schema: await introspectSchema(usersRemoteExecutor, adminContext),
        executor: usersRemoteExecutor,
      },
      {
        schema: await introspectSchema(blockchainRemoteExecutor, adminContext),
        executor: blockchainRemoteExecutor,
      },
    ],
  })
}

makeGatewaySchema().then( schema => {
  const server = new ApolloServer({ 
    schema: schema, 
    context: (query) => {
      return {
        authHeader:  query.req.headers.authorization || '',
      }
    },
    // Add this to change landing page, necesary for this version of ApolloServer
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  })

  const port = 4000

  server.listen(port).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  })
})

