import ApolloClient from "apollo-boost";
import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache();

const gqlClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/graphprotocol/uniswap",
  cache
});

export default gqlClient;