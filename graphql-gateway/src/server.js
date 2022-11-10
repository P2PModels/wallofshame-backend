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
  const usersRemoteExecutor = makeRemoteExecutor(
    `${process.env.USERS_API_ENDPOINT}/`
  );
  const casesBackendRemoteExecutor = makeRemoteExecutor(
    `${process.env.CASES_BACKEND_API_ENDPOINT}/`
  );
  const casesSubgraphRemoteExecutor = makeRemoteExecutor(
    `${process.env.CASES_SUBGRAPH_API_ENDPOINT}`
  );
  // const adminContext = { authHeader: "Commons my-app-to-app-token" };
  
  return stitchSchemas({
    subschemas: [
      {
        // schema: await introspectSchema(usersRemoteExecutor, adminContext),
        schema: await introspectSchema(usersRemoteExecutor),
        executor: usersRemoteExecutor,
      },
      {
        // schema: await introspectSchema(casesBackendRemoteExecutor, adminContext),
        schema: await introspectSchema(casesBackendRemoteExecutor),
        executor: casesBackendRemoteExecutor,
      },
      {
        // schema: await introspectSchema(casesSubgraphRemoteExecutor, adminContext),
        schema: await introspectSchema(casesSubgraphRemoteExecutor),
        executor: casesSubgraphRemoteExecutor,
      },
    ],
  });
}

waitOn({
  resources: [
    // `tcp:${process.env.USERS_API_ENDPOINT}`,
    `tcp:4001`,
    
    // `tcp:${process.env.CASES_API_ENDPOINT}`,
    `tcp:4002`,

    // The subgraph endpoint returns a 404 when a GET request 
    // is done, therefore it can't be monitored with this library
  ],
  log: true,
})
  .then(() => {
    console.log("Creating schema...")
    makeGatewaySchema().then((schema) => {
      const server = new ApolloServer({
        schema: schema,
        // context: (query) => {
        //   return {
        //     authHeader: query.req.headers.authorization || "",
        //   };
        // },
        // Add this to change landing page, necesary for this version of ApolloServer
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
      });

      const port = 4000;

      server.listen(port).then(({ url }) => {
        console.log(`🚀 API Gateway ready at ${url}`);
      })
      .catch((e) => {
        console.log("Error while trying to set the server to listen")
      })

    })
    .catch((e) => {
      console.log("Schema creation error")
      console.log(e)
    })
  })
  .catch((e) => {
    console.log("Wait on error");
  });
