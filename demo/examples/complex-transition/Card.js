import React, { Component, PropTypes } from 'react';
import Link from 'react-router-dom/Link';
import classnames from 'classnames';
import ReactFlipElement from '../../../src/ReactFlipElement';
import ReactFlipContainer, {
  BEFORE_ANIMATION
} from '../../../src/ReactFlipContainer';
import { CardShape } from './cards';

const Image = props => (
  <ReactFlipElement
    options={{
      id: props.card.path + '-image',
      updateScale: false
    }}
  >
    {({ setFlipElement }) => (
      <div
        className="card__image"
        ref={setFlipElement}
        style={{
          backgroundImage: `url(${props.card.image})`,
          backgroundSize: 'cover'
        }}
      />
    )}
  </ReactFlipElement>
);

const BackgroundGradient = props => (
  <ReactFlipElement options={{ id: props.card.path + '-bg-gradient' }}>
    {({ setFlipElement }) => (
      <div className="card__background-gradient" ref={setFlipElement} />
    )}
  </ReactFlipElement>
);

const BackgroundSolid = props => (
  <ReactFlipElement options={{ id: props.card.path + '-bg-solid' }}>
    {({ setFlipElement }) => (
      <div className="card__background-solid" ref={setFlipElement} />
    )}
  </ReactFlipElement>
);

const Background = props => (
  <div>
    <BackgroundGradient card={props.card} />
    <BackgroundSolid card={props.card} />
  </div>
);

const Title = props => (
  <ReactFlipElement options={{ id: props.card.path + '-title' }}>
    {({ setFlipElement }) => (
      <div className="card__title" ref={setFlipElement}>
        <h3>
          <Link to={props.selected ? '/complex-transition' : props.card.path}>
            {props.card.title}
          </Link>
        </h3>
      </div>
    )}
  </ReactFlipElement>
);

const Description = props => (
  <ReactFlipElement
    options={{
      id: props.card.path + '-description',
      updateScale: false,
      updateTranslate: false,
      delay: 200
    }}
  >
    {({ setFlipElement }) => (
      <div
        className="card__content"
        ref={setFlipElement}
        dangerouslySetInnerHTML={{ __html: props.card.description }}
      />
    )}
  </ReactFlipElement>
);

class Card extends Component {
  constructor() {
    super();
    this.lastHeight = 80;
  }

  componentDidMount() {
    if (this.card && !this.selectedAtPreviousRender) {
      this.lastHeight = this.card.clientHeight;
    }
  }

  render() {
    const isSelected = (this.props.selected &&
      this.context.flip.status() !== BEFORE_ANIMATION) ||
      (this.selectedAtPreviousRender &&
        this.context.flip.status() === BEFORE_ANIMATION);

    this.selectedAtPreviousRender = this.props.selected;

    return (
      <div className="card-container" style={{ height: this.lastHeight }}>
        <div
          ref={card => this.card = card}
          className={classnames('card', {
            'card--selected': isSelected
          })}
        >
          <Image card={this.props.card} />
          <Background card={this.props.card} />
          <Title card={this.props.card} selected={this.props.selected} />
          {this.props.selected && <Description card={this.props.card} />}
        </div>
      </div>
    );
  }
}

Card.contextTypes = ReactFlipContainer.childContextTypes;

Card.propTypes = {
  card: CardShape.isRequired,
  selected: PropTypes.bool.isRequired
};

export default Card;
