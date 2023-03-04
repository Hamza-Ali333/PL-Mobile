import { ApolloClient } from "apollo-client";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistCache } from "apollo-cache-persist";
import { RetryLink } from "apollo-link-retry";
import { ApolloLink } from "apollo-link";
import link from "../constants/link";

const retryLink = new RetryLink({
  delay: {
    initial: 1000,
  },
  attempts: {
    max: 1000,
    retryIf: (error, _operation) => {
      if (error.message === "Network request failed") {
        if (_operation.operationName === "createAnswer") {
          return true;
        }
        if (_operation.operationName === "createAnswerComment") {
          return true;
        }
        if (_operation.operationName === "createQuestion") {
          return true;
        }
      }
      return false;
    },
  },
});

const cache = new InMemoryCache({});
const httpLink = createUploadLink();
const apLink = ApolloLink.from([retryLink, httpLink]);

const persist = persistCache({
  cache,
  storage: AsyncStorage,
});

const authLink = setContext(async (_, { headers }) => {
  const save = await AsyncStorage.getItem("userSession");
  const item = JSON.parse(save);
  if (item) {
    return {
      uri: link.url + "/graphql", //item.uri,
      headers: {
        ...headers,
        Authorization: `Bearer ${item.token}` || null,
      },
    };
  } else {
    return {
      uri: link.url + "/graphql", //item.uri,
    };
  }
});

const client = new ApolloClient({
  link: authLink.concat(apLink),
  cache: cache,
});

export default client;
