import React from 'react';
import FlipGroup from './FlipGroup';
import Flip from './Flip';

const shouldAnimate = props =>
  typeof props.shouldAnimate === 'undefined' ||
  (typeof props.shouldAnimate === 'function'
    ? props.shouldAnimate(props)
    : props.shouldAnimate);

export const STATIC = 'ReactFlip_static';
export const BEFORE_ANIMATION = 'ReactFlip_before';
export const ANIMATION = 'ReactFlip_animation';

class FlipContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      animating: false,
      preparingAnimation: false,
      status: STATIC
    };
    this.flip = new FlipGroup();
    this.onAnimationStartCallbacks = [];
    this.onAnimationEndCallbacks = [];
    this.registerElement = this.registerElement.bind(this);
    this.triggerAnimation = this.triggerAnimation.bind(this);
  }

  getChildContext() {
    return {
      flip: {
        defer: () => this.props.defer,
        status: () => this.state.status,
        registerElement: this.registerElement
      }
    };
  }

  registerElement(element, options, onAnimationStart, onAnimationEnd) {
    this.onAnimtionStartCallbacks = [
      ...this.onAnimationStartCallbacks,
      onAnimationStart
    ];
    this.onAnimtionEndCallbacks = [
      ...this.onAnimationEndCallbacks,
      onAnimationEnd
    ];
    const flip = new Flip({ element, options });
    return this.flip.addElement(flip);
  }

  componentWillReceiveProps(nextProps) {
    if (shouldAnimate(nextProps) && this.props !== nextProps) {
      if (nextProps.defer) {
        this.setState({
          animating: false,
          preparingAnimation: true,
          status: BEFORE_ANIMATION
        });
        if (process.env.NODE_ENV === 'development' && this.props.debug) {
          console.warn('ReactFlip: Setup');
        }
      } else {
        this.first();
        this.setState({
          animating: true,
          preparingAnimation: false,
          status: ANIMATION
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (shouldAnimate(this.props)) {
      if (this.props !== prevProps) {
        if (this.props.defer) {
          this.first();
          this.setState({
            animating: true,
            preparingAnimation: false,
            status: ANIMATION
          });
        } else {
          this.triggerAnimation();
        }
      } else if (
        prevState.preparingAnimation !== this.state.preparingAnimation
      ) {
        this.triggerAnimation();
      }
    }
  }

  triggerAnimation() {
    this.last();
    if (this.invert()) {
      this.play();
    }
  }

  first() {
    this.flip.first();
    if (process.env.NODE_ENV === 'development' && this.props.debug) {
      console.warn('ReactFlip: First');
    }
  }

  last() {
    this.flip.last();
    if (process.env.NODE_ENV === 'development' && this.props.debug) {
      console.warn('ReactFlip: Last');
    }
  }

  invert() {
    const result = this.flip.invert();
    if (process.env.NODE_ENV === 'development' && this.props.debug) {
      console.warn('ReactFlip: Invert');
    }
    return result;
  }

  play() {
    const playPromise = this.flip.play();

    if (playPromise) {
      if (process.env.NODE_ENV === 'development' && this.props.debug) {
        console.warn('ReactFlip: Play');
      }
      this.onAnimationStart()
        .then(() => playPromise)
        .then(() => this.onAnimationEnd());
    }
  }

  onAnimationStart() {
    this.onAnimationStartCallbacks.forEach(callback => {
      callback();
    });
    return Promise.resolve();
  }

  onAnimationEnd() {
    this.onAnimationEndCallbacks.forEach(callback => {
      callback();
    });
    return new Promise((resolve, reject) => {
      this.setState({ animating: false, status: STATIC }, resolve);
    });
  }

  render() {
    return this.props.children();
  }
}

FlipContainer.propTypes = {
  children: React.PropTypes.func.isRequired
};

FlipContainer.childContextTypes = {
  flip: React.PropTypes.shape({
    registerElement: React.PropTypes.func.isRequired
  }).isRequired
};

export default FlipContainer;
