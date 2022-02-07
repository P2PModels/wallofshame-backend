const { print } = require("graphql");
const { fetch } = require("cross-fetch");

module.exports = function makeRemoteExecutor(url) {
  return async ({ document, variables, context }) => {

    let query = typeof document === "string" ? document : print(document);

    // console.log("<query>");
    // console.log(query);

    // TODO: Dive deeper in the error.  The Graph its not returning
    // a value for the __typename field but the protocol force a non-null 
    // response. Quick fix its to remove it from queries that are not the 
    // introspecting ones. Since I dont know precisly how to differentiate them
    // I just check for a field that I've seeing its defined in the introspection
    // queries.
    if(document.definitions[0].name == undefined){
      // Remove __typename from query
      query = query.replace('__typename', '');
      // console.log("<noTypenameQuery>");
      // console.log(query);
    }
    // console.log("<variables>");
    // console.log(variables);

    let fetchResult;
    try {
      fetchResult = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: context.authHeader || "",
        },
        body: JSON.stringify({ query, variables }),
      });

      // console.log("Fetch result");
      // console.log(fetchResult);
      
    } catch (e) {
      console.log(e);
    }

    return fetchResult.json();
  };
};
