import React, { Component, Fragment } from 'react';
import { GET_USERS } from '../../utilities/graphql/queries';
import { Query } from "react-apollo";
import Feed from './Feed';
import EthTransfer from './EthTransfer';
import styles from './styles.module.css';

export default class Main extends Component {
    constructor() {
        super();
        this.state={
            loadInitialAmount: 10,
            loadMoreAmount: 10
        }
    }

    render () {
        const { loadInitialAmount, loadMoreAmount } = this.state;
        return (
            <Fragment>
                <div className={styles.IntroductionContainer}>
                    <p>Assignment for Terminal. ETH Transfer will update the graphQl cache if the user Id is already fetched in the feed. The feed will update progressively by scrolling.</p>
                </div>

                <EthTransfer />

                <Query
                    query={GET_USERS}
                    variables={{
                        first: loadInitialAmount,
                        skip: undefined
                    }}
                    fetchPolicy="cache-and-network"
                >
                {({ data, loading, fetchMore }) =>(
                    <Feed
                        users={data.users || []}
                        loading={loading}
                        onLoadMore={() => 
                            fetchMore({
                              variables: {
                                first: loadMoreAmount,
                                skip: data.users.length
                              },
                              updateQuery: (prev, { fetchMoreResult }) => {
                                if (!fetchMoreResult) return prev;
                                return Object.assign({}, prev, {
                                  users: [...prev.users, ...fetchMoreResult.users]
                                });
                              }
                            })
                          }
                    />
                )}
                </Query>   
            </Fragment>
        )
    }
}