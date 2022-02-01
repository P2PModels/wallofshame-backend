const { print } = require("graphql");
const { fetch } = require("cross-fetch");

module.exports = function makeRemoteExecutor(url) {
  return async ({ document, variables, context }) => {
    const query = typeof document === "string" ? document : print(document);

    let fetchResult;
    try {
      fetchResult = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: context.authHeader || "",
        },
        body: JSON.stringify({ query, variables }),
      });

      console.log("Fetch result");
      console.log(fetchResult);
      
    } catch (e) {
      console.log(e);
    }

    return fetchResult.json();
  };
};
