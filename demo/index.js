import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Navigation from './Navigation';
import Examples from './Examples';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <h1>react-flip</h1>
          <Navigation />
          <Examples />
        </div>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
