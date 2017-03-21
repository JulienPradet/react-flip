import React from 'react';
import FlipGroup from './FlipGroup';
import Flip from './Flip';

const shouldAnimate = props =>
  typeof props.shouldAnimate === 'undefined' ||
  (typeof props.shouldAnimate === 'function'
    ? props.shouldAnimate(props)
    : props.shouldAnimate);

class FlipContainer extends React.Component {
  constructor() {
    super();
    this.state = { animating: false };
    this.flip = new FlipGroup();
    this.registerElement = this.registerElement.bind(this);
    this.triggerAnimation = this.triggerAnimation.bind(this);
  }

  getChildContext() {
    return {
      flip: {
        registerElement: this.registerElement,
        triggerAnimation: this.triggerAnimation
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if (shouldAnimate(nextProps) && this.props !== nextProps) {
      this.flip.first();
    }
  }

  componentDidUpdate(prevProps) {
    if (shouldAnimate(this.props) && this.props !== prevProps) {
      this.triggerAnimation();
    }
  }

  triggerAnimation() {
    this.flip.last();
    if (this.flip.invert()) {
      const promise = this.flip.play();

      if (promise) {
        this.setState({ animating: true }, () => {
          promise.then(() => {
            this.setState({ animating: false });
          });
        });
      }
    }
  }

  registerElement(element, options) {
    const flip = new Flip({ element, options });
    return this.flip.addElement(flip);
  }

  render() {
    return this.props.children({ animating: this.state.animating });
  }
}

FlipContainer.propTypes = {
  children: React.PropTypes.func.isRequired
};

FlipContainer.childContextTypes = {
  flip: React.PropTypes.shape({
    registerElement: React.PropTypes.func.isRequired,
    triggerAnimation: React.PropTypes.func.isRequired
  }).isRequired
};

export default FlipContainer;
