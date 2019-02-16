import React, { Component } from 'react';
import * as web3Utils from 'web3-utils';
import InfiniteScroll from 'react-infinite-scroller';
import _ from 'lodash';
import styles from './styles.module.css';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';

class Feed extends Component {
    constructor(props) {
        super(props);

        this.state={
            loadAmount: 20,
            hasMoreItems: true, // API lacking a way to know max amount of users
            showModal: false,
            modalTransactions: [],
            modalUserId: '0x00...'
        }

        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalShow = this.handleModalShow.bind(this);
    }

    handleModalShow( txs, userId ) {
        const transactions=_.cloneDeep(txs)
        this.setState({
            showModal: true,
            modalTransactions: transactions,
            modalUserId: userId
        })
    }

    handleModalClose() {
        this.setState({ showModal: false })
    }

    // computes the balance of Eth and token from txs
    // TODO: ...search way to get user balance directly from api?
    computeUserBalance( txs ) {
        let balance = { 
            ETH:0
        }

        // add up amounts from txs
        txs.forEach( tx =>{
            balance.ETH += Number(web3Utils.fromWei(tx.ethAmount));
            // add token symbol if does not exist
            if (!balance.hasOwnProperty(tx.tokenSymbol)) {
                balance[tx.tokenSymbol]=0;
            }
            balance[tx.tokenSymbol] += Number(web3Utils.fromWei(tx.tokenAmount));
        })

        return balance;
    }
    
    render() {
        const users = this.props.users;
        const Loader=()=>(<div className={styles.Loader}>Loading...</div>)
        return (
            <div className={styles.FeedContainer}>
                <h2 className={styles.Title}>Users Feed</h2>
                {  
                    this.props.users.length !== 0
                    ?
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={this.props.onLoadMore}
                        hasMore={true}
                        loader={<Loader key={0}/>}
                        initialLoad={false}
                        >
                        <ul className={styles.FeedList}>
                            {
                                users.map((user, index)=>{
                                    const balances=this.computeUserBalance(user.txs);
                                    const balanceFormatted = ()=>{return Object.keys(balances).map((symbol, index)=>{
                                        return (
                                            <div key={index}>
                                                <span>{
                                                    `${symbol} Balance: ${balances[symbol]}`
                                                }</span>
                                                <br />
                                            </div>
                                        )
                                    })}

                                    return(
                                        <li key={index} onClick={this.handleModalShow.bind(this, user.txs, user.id)}>
                                            <Card style={{ width:'600px' }}>
                                                <Card.Header>
                                                    {`User Id: ${user.id}`}
                                                </Card.Header> 
                                                <Card.Body>
                                                    {balanceFormatted()}
                                                </Card.Body>
                                                    
                                            </Card>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        
                        <Modal
                            show={this.state.showModal}
                            onHide={this.handleModalClose}
                            >

                            <Modal.Header>
                                <span className={styles.ModalHeader}>{`Transactions For User Id ${this.state.modalUserId}`}</span>
                            </Modal.Header>
                            <Modal.Body>
                                {this.state.modalTransactions.map((tx, index)=>{
                                    return (
                                        <div className={styles.TransactionContainer} key={tx.id}>
                                            <h3 className={styles.TransactionTitle}>{`Transaction #${index+1}`}</h3>
                                                <ul className={styles.TransactionListContainer}>
                                                    <li>{`ETH Amount: ${tx.ethAmount}`}</li>
                                                    <li>{`${tx.tokenSymbol} Amount: ${tx.tokenAmount}`}</li>
                                                </ul>
                                            </div>
                                    )
                                })}
                            </Modal.Body>
                        </Modal>
                    </InfiniteScroll>
                    :
                    <Loader key={0}/>
                }
            </div>
        )
    }
}

export default Feed;