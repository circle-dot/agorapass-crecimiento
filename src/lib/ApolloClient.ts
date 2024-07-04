// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
        fetchOptions: {
            // Add any fetch options here
        },
    }),
});

export default client;
