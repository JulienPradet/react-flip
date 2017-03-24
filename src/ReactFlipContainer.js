import { Component, PropTypes } from 'react';
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

class FlipContainer extends Component {
  constructor(props) {
    super();
    this.state = {
      animating: false,
      preparingAnimation: false,
      status: STATIC
    };
    this.flip = new FlipGroup({ debug: props.debug });
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

  registerElement({ element, options, defer }) {
    const flip = new Flip({ element, options, debug: this.props.debug });
    return this.flip.addElement(flip, defer);
  }

  componentWillReceiveProps(nextProps) {
    if (shouldAnimate(nextProps) && this.props !== nextProps) {
      if (nextProps.defer) {
        this.first({ deferred: false });
        this.setState({
          animating: false,
          preparingAnimation: true,
          status: BEFORE_ANIMATION
        });
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
          this.first({ deferred: true });
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

  first({ deferred } = { deferred: false }) {
    if (process.env.NODE_ENV === 'development' && this.props.debug) {
      console.groupCollapsed(
        `ReactFlip: First ${deferred ? '(deferred)' : '(normal)'}`
      );
    }
    this.flip.first({ deferred });
    if (process.env.NODE_ENV === 'development' && this.props.debug) {
      console.groupEnd();
    }
  }

  last() {
    if (process.env.NODE_ENV === 'development' && this.props.debug) {
      console.groupCollapsed('ReactFlip: Last');
    }
    this.flip.last();
    if (process.env.NODE_ENV === 'development' && this.props.debug) {
      console.groupEnd();
    }
  }

  invert() {
    if (process.env.NODE_ENV === 'development' && this.props.debug) {
      console.groupCollapsed('ReactFlip: Invert');
    }
    const result = this.flip.invert();
    if (process.env.NODE_ENV === 'development' && this.props.debug) {
      console.groupEnd();
    }
    return result;
  }

  play() {
    if (process.env.NODE_ENV === 'development' && this.props.debug) {
      console.groupCollapsed('ReactFlip: Play');
    }
    const playPromise = this.flip.play();

    if (playPromise) {
      this.onAnimationStart()
        .then(() => playPromise)
        .then(() => {
          if (process.env.NODE_ENV === 'development' && this.props.debug) {
            console.groupEnd();
          }
        })
        .then(() => this.onAnimationEnd());
    } else {
      if (process.env.NODE_ENV === 'development' && this.props.debug) {
        console.debug('ReactFlip: Nothing to play');
        console.groupEnd();
      }
    }
  }

  onAnimationStart() {
    return Promise.resolve();
  }

  onAnimationEnd() {
    return new Promise((resolve, reject) => {
      this.setState({ animating: false, status: STATIC }, resolve);
    });
  }

  render() {
    return this.props.children();
  }
}

FlipContainer.propTypes = {
  defer: PropTypes.bool.isRequired,
  children: PropTypes.func.isRequired
};

FlipContainer.defaultProps = {
  defer: false
};

FlipContainer.childContextTypes = {
  flip: PropTypes.shape({
    registerElement: PropTypes.func.isRequired
  }).isRequired
};

export default FlipContainer;
