# 📊 Wall of Shame backend 📊

The Wall of Shame prototype will combine data-activism with the Ethereum blockchain to provide a censorship-resistant dashboard of unpaid invoices from cultural workers.

The back-end of this prototype uses the following technologies:
- Hardhat framework alogn with Waffle for smart contracts development, testing and deploying. Visit [smart-contracts](./smart-contracts) folder.
- The Graph for indexing smart contracts events and provide processed data trough GrapQL API. Visit [thegraph](./thegraph) folder.
- Prisma with Postgres DB to provide access to the private backend trough a GraphQL API. Visit [graphql-server](./graphql-server) folder.

## Screenshots

<img src="./public/assets/map.png" width="49%" style="display: inline-block">
<img src="./public/assets/dashboard.png" width="49%" style="display: inline-block">
<img src="./public/assets/form.png" width="49%" >
<img src="./public/assets/form2.png" width="49%" >


## Instalation and Setup (Ubuntu 20.04 LTS)

In order to setup and run the front-end run the following commands:

``` bash
$ git clone https://github.com/p2pmodels/wallofshame-backend
$ cd wallofshame-backend
$ git checkout prod
$ docker-compose up
```

The front-end of this repo is in [Wall of Shame frontend](https://github.com/P2PModels/wallofshame-frontend)

## Documentation

Read the [docs](https://observatorio.docs.p2pmodels.eu) for more information


