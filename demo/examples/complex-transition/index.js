import React, { Component } from 'react';
import withRouter from 'react-router/withRouter';
import './index.scss';
import cards from './cards';
import CardList from './CardList';

class ComplexTransition extends Component {
  constructor(props) {
    super();
    this.state = {
      cards: cards(props.match.path)
    };
  }

  render() {
    return (
      <div className="complex-container">
        <CardList cards={this.state.cards} />
      </div>
    );
  }
}

export default withRouter(ComplexTransition);
