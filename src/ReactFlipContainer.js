import { Children, Component, PropTypes } from 'react';
import FlipGroup from './FlipGroup';
import Flip from './Flip';

const getDeferType = deferred =>
  deferred === undefined ? '' : deferred ? '(deferred)' : '(normal)';

const shouldAnimate = props =>
  typeof props.shouldAnimate === 'undefined' ||
  (typeof props.shouldAnimate === 'function'
    ? props.shouldAnimate(props)
    : props.shouldAnimate);

export const STATIC = 'ReactFlip_static';
export const BEFORE_ANIMATION = 'ReactFlip_before';
export const ANIMATION = 'ReactFlip_animation';

class ReactFlipContainer extends Component {
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
        status: () => this.state.status,
        registerElement: this.registerElement
      }
    };
  }

  registerElement({ element, options }) {
    const flip = new Flip({ element, options, debug: this.props.debug });

    const defer = typeof options === 'function'
      ? () => options().defer
      : options.defer;

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
          // Set correct position of the undeferred elements
          this.last({ deferred: false });
          this.invert({ deferred: false });

          // Set initial position of the deferred elements
          this.first({ deferred: true });

          // The animation will now begin on next update
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

  first({ deferred } = {}) {
    if (process.env.NODE_ENV === 'development' && this.props.debug) {
      const type = getDeferType(deferred);
      console.groupCollapsed(`ReactFlip: First ${type}`);
    }
    this.flip.first({ deferred });
    if (process.env.NODE_ENV === 'development' && this.props.debug) {
      console.groupEnd();
    }
  }

  last({ deferred } = {}) {
    if (process.env.NODE_ENV === 'development' && this.props.debug) {
      const type = getDeferType(deferred);
      console.groupCollapsed(`ReactFlip: Last ${type}`);
    }
    this.flip.last({ deferred });
    if (process.env.NODE_ENV === 'development' && this.props.debug) {
      console.groupEnd();
    }
  }

  invert({ deferred } = {}) {
    if (process.env.NODE_ENV === 'development' && this.props.debug) {
      const type = getDeferType(deferred);
      console.groupCollapsed(`ReactFlip: Invert ${type}`);
    }
    const result = this.flip.invert({ deferred });
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
    return Children.only(this.props.children);
  }
}

ReactFlipContainer.propTypes = {
  defer: PropTypes.bool,
  children: PropTypes.node.isRequired
};

ReactFlipContainer.defaultProps = {
  defer: false
};

ReactFlipContainer.childContextTypes = {
  flip: PropTypes.shape({
    status: PropTypes.func.isRequired,
    registerElement: PropTypes.func.isRequired
  }).isRequired
};

export default ReactFlipContainer;
