import React, { Component } from 'react';
import Header from './components/Header';
import Main from './components/Main';
import { ApolloProvider } from "react-apollo";
import gqlClient from './utilities/graphql/client';
import './App.css';

class App extends Component {
  render() {
    return (
      <ApolloProvider client={gqlClient}>
        <div>
          <Header />
          <Main />
        </div>
      </ApolloProvider>
    )
  }
}

export default App;
