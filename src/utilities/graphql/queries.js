import gql from 'graphql-tag';

export const GET_USERS = gql`
    query users($first: Int, $skip: Int) {
        users(first: $first, skip: $skip) @connection(key: "feed", filter: ["type"]) {
            id
            txs {
                id
                ethAmount
                tokenAmount
                tokenSymbol
            }
        }
    }
`