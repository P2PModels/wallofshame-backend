import { ApolloServer } from 'apollo-server'
import { schema } from './schema'
import { context } from './context'
require("dotenv").config();

const server = new ApolloServer({
  schema: schema,
  context: context,
})

const port = process.env.PORT  

server.listen(port).then(async ({ url }) => {
  console.log(`\
🚀 Report service ready at: ${url}
⭐️ See sample queries: http://pris.ly/e/ts/graphql#using-the-graphql-api
  `)
})
