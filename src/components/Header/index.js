import React, { Component } from 'react';
import styles from './styles.module.css';
import UniswapLogo from '../../images/uniswap_logo.svg';

export default class Header extends Component {
    render () { 
        return (
            <div>
                <h1 className={styles.Title}>Uni<span className={styles.TitleOrange}>Swap</span>
                    <img src={UniswapLogo} alt='uniswap-logo'></img>    
                Viewer</h1>
            </div>
            )
    }
}