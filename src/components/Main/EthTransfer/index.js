import React, { Component } from 'react';
import { ApolloConsumer } from "react-apollo";
import { GET_USERS } from '../../../utilities/graphql/queries';
import _ from 'lodash';
import * as web3Utils from 'web3-utils';
import styles from './styles.module.css';

// importing components this way results in smaller bundles
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

class EthTransfer extends Component { 
    constructor() {
        super();
        this.state={
            fromId: '',
            toId: '',
            ethAmount: ''
        }
    }

    addTransactionIfPossible(data, fromId, toId, ethAmount) {
        // search if userIds are present
        for ( let i=0; i<data.length; i++ ) {
            // if present add a new tx
            if(data[i].id === fromId) {
                data[i].txs.push({
                    __typename: "Transaction",
                    tokenSymbol: "DAI",
                    tokenAmount: "0",
                    ethAmount: '-' + web3Utils.toWei(ethAmount),
                    id: fromId+Math.random(0, 1000000000) // fake id
                })
            } else if( data[i].id === toId ){
                data[i].txs.push({
                    __typename: "Transaction",
                    tokenSymbol: "DAI",
                    tokenAmount: "0",
                    ethAmount: web3Utils.toWei(ethAmount),
                    id: toId+Math.random(0, 1000000000) // fake id
                })
            }
        }
        return data;
    }

    clickHandler(client) {
        const initialData = client.readQuery({
            query: GET_USERS,
        })

        let newUsers = _.cloneDeep( initialData.users )

        // We update the newUsers object with new transactions
        newUsers = this.addTransactionIfPossible(
            newUsers,
            this.state.fromId,
            this.state.toId,
            this.state.ethAmount )

        client.writeQuery({
            query: GET_USERS,
            data: {
                users: [...newUsers]
            }
        })
    }

    handleChange(fieldName, evt) {
        this.setState({
            [fieldName]: evt.target.value
        })
    }

    render () {
        return (
            <ApolloConsumer>
                { client =>{
                    return(
                        <div className={styles.ComponentContainer}>
                            <h2>ETH Transfer</h2>
                            <div className={styles.InputsContainer}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>
                                            From
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        placeholder='0x000...'
                                        value={this.state.fromId}
                                        onChange={this.handleChange.bind(this, 'fromId')}
                                        />
                                </InputGroup>

                                <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        To
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    placeholder='0x000...'
                                    value={this.state.toId}
                                    onChange={this.handleChange.bind(this, 'toId')}
                                    />
                                </InputGroup>

                                <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        ETH
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    placeholder='Amount of Ether to be transferred'
                                    value={this.state.ethAmount}
                                    onChange={this.handleChange.bind(this, 'ethAmount')}
                                    />
                                </InputGroup>
                            </div>
                            <Button variant='warning' onClick={this.clickHandler.bind(this, client)}>
                                <span className={styles.BtnText}>Transfer ETH</span>
                            </Button>
                        </div>
                        )
                } }
            </ApolloConsumer>

        )
    }
}

export default EthTransfer;