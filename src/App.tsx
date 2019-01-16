import React, { Component } from 'react';
import RepositoriesList from './components/RepositoriesList';

class App extends Component {
  public render(): JSX.Element {
    return <RepositoriesList language='javascript' />;
  }
}

export default App;
