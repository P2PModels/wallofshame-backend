import { ApolloServer } from 'apollo-server'
import { schema } from './schema'
import { createContext } from './context'
require("dotenv").config();

const server = new ApolloServer({
  schema: schema,
  context: createContext,
})

const port = process.env.PORT  


server.listen(port).then(async ({ url }) => {
  console.log(`\
🚀 Server ready at: ${url}
⭐️ See sample queries: http://pris.ly/e/ts/graphql#using-the-graphql-api
  `)
})
