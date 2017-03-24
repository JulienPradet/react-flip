import React, { Component, PropTypes } from 'react';
import ReactFlipContainer, {
  ANIMATION,
  BEFORE_ANIMATION,
  STATIC
} from '../../../src/ReactFlipContainer';
import ReactFlipElement from '../../../src/ReactFlipElement';
import withFlipStatus from '../../../src/withFlipStatus';

const statusToStyleCreator = {
  [ANIMATION]: (props, options) =>
    props.show ? options.enterStyle : options.leaveStyle,
  [BEFORE_ANIMATION]: (props, options) =>
    props.show ? options.leaveStyle : options.enterStyle,
  [STATIC]: (props, options) =>
    props.show ? options.enterStyle : options.leaveStyle
};

const TogglableFlipElement = (options = {}) =>
  BaseComponent => {
    const makeStyle = (props, status) => ({
      ...props.style,
      ...statusToStyleCreator[status](props, options)
    });

    const FlipBaseComponent = ReactFlipElement(options)(BaseComponent);

    class TogglableFlipElement extends Component {
      render() {
        const { flip, ...props } = this.props;
        if (props.show || flip.status() !== STATIC) {
          return (
            <FlipBaseComponent
              {...props}
              style={makeStyle(props, flip.status())}
            />
          );
        } else {
          return null;
        }
      }
    }

    TogglableFlipElement.propTypes = {
      show: PropTypes.bool.isRequired
    };

    return withFlipStatus()(TogglableFlipElement);
  };

const Content = TogglableFlipElement({
  enterStyle: { marginTop: 20, opacity: 1 },
  leaveStyle: { marginTop: 0, opacity: 0 }
})(props => (
  <div ref={props.flip.setFlipElement} style={props.style}>
    Content
  </div>
));

class Dropdown extends Component {
  constructor() {
    super();
    this.state = { opened: false };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(state => ({ opened: !state.opened }));
  }

  render() {
    return (
      <ReactFlipContainer defer debug>
        {() => (
          <div>
            <button onClick={this.toggle}>
              {this.state.opened ? 'Close' : 'Open'}
            </button>
            <Content show={this.state.opened} />
          </div>
        )}
      </ReactFlipContainer>
    );
  }
}

export default Dropdown;
