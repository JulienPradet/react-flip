import React, { Component, PropTypes } from 'react';
import Route from 'react-router/Route';
import ReactFlipContainer from '../../../src/ReactFlipContainer';
import Card from './Card';

class CardList extends Component {
  render() {
    return (
      <ReactFlipContainer forceDefer>
        <div className="card-list">
          {this.props.cards.map((card, index) => (
            <Route
              key={card.path}
              path={card.path}
              children={({ match }) => (
                <Card selected={Boolean(match)} card={card} />
              )}
            />
          ))}
        </div>
      </ReactFlipContainer>
    );
  }
}

CardList.propTypes = {
  cards: PropTypes.array.isRequired
};

export default CardList;
