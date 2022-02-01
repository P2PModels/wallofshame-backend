const { introspectSchema } = require("@graphql-tools/wrap");
const { stitchSchemas } = require("@graphql-tools/stitch");
const { ApolloServer } = require("apollo-server");
const makeRemoteExecutor = require("./utils/makeRemoteExecutor");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
const waitOn = require("wait-on");

require("dotenv").config();

async function makeGatewaySchema() {
  // const usersRemoteExecutor = makeRemoteExecutor(
  //   `http://${process.env.USERS_API_ENDPOINT}/`
  // );
  // const blockchainRemoteExecutor = makeRemoteExecutor(
  //   `http://${process.env.BLOCKCHAIN_API_ENDPOINT}/`
  // );
  const subgraphRemoteExecutor = makeRemoteExecutor(
    `${process.env.SUBGRAPH_API_ENDPOINT}`
  );
  const adminContext = { authHeader: "Commons my-app-to-app-token" };

  return stitchSchemas({
    subschemas: [
      // {
      //   schema: await introspectSchema(usersRemoteExecutor, adminContext),
      //   executor: usersRemoteExecutor,
      // },
      // {
      //   schema: await introspectSchema(blockchainRemoteExecutor, adminContext),
      //   executor: blockchainRemoteExecutor,
      // },
      {
        schema: await introspectSchema(subgraphRemoteExecutor, adminContext),
        executor: subgraphRemoteExecutor,
      },
    ],
  });
}

// waitOn({
//   resources: [
    // `tcp:${process.env.USERS_API_ENDPOINT}`,
    // `tcp:${process.env.BLOCKCHAIN_API_ENDPOINT}`,

    // The subgraph endpoint returns a 404 when a GET request 
    // is done, therefore it can't be monitored with this library
  // ],
//   log: true,
// })
//   .then(() => {
    makeGatewaySchema().then((schema) => {
      const server = new ApolloServer({
        schema: schema,
        context: (query) => {
          return {
            authHeader: query.req.headers.authorization || "",
          };
        },
        // Add this to change landing page, necesary for this version of ApolloServer
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
      });

      const port = 4000;

      server.listen(port).then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
      });
    });
  // })
  // .catch((e) => {
  //   console.log("Wait on error");
  // });
