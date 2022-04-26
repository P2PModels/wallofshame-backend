# 📊 Wall of Shame backend 📊

The Wall of Shame prototype will combine data-activism with the Ethereum blockchain to provide a censorship-resistant dashboard of unpaid invoices from cultural workers.

The back-end of this prototype uses the following technologies:
- Hardhat framework alogn with Waffle for smart contracts development, testing and deploying. Visit [smart-contracts](./smart-contracts) folder.
- The Graph for indexing smart contracts events and provide processed data trough GrapQL API. Visit [thegraph](./thegraph) folder.
- Prisma with Postgres DB to provide access to the private backend trough a GraphQL API. Visit [graphql-server](./graphql-server) folder.



## Instalation and Setup


### Stand alone

In order to setup and run the backend as stand alone run:

```
$ npm install
$ npm run dev
```

### Docker

1. Build and run docker container `docker-compose -f docker-compose.yaml up --build -d`

A new tab in your default browser should open automatically.

The front-end of this repo is in [Wall of Shame frontend](https://github.com/P2PModels/wallofshame-frontend)



