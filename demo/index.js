import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import Navigation from './Navigation';
import Examples from './Examples';
import './style/index.scss';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <Navigation />
          <Examples />
        </div>
      </HashRouter>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
