import React, { Component } from 'react';
import ReactFlipContainer, {
  ANIMATION,
  BEFORE_ANIMATION,
  STATIC
} from '../../../src/ReactFlipContainer';
import ReactFlipElement from '../../../src/ReactFlipElement';

const statusToStyleCreator = {
  [ANIMATION]: (props, options) => props.show ? {} : options.leaveStyle,
  [BEFORE_ANIMATION]: (props, options) => props.show ? options.enterStyle : {},
  [STATIC]: (props, options) => ({})
};

const Content = ReactFlipElement({ defer: true })(props => {
  if (props.show || props.flip.status !== STATIC) {
    return (
      <div
        ref={props.flip.setFlipElement}
        style={{
          marginTop: 20,
          ...statusToStyleCreator[props.flip.status](props, {
            enterStyle: { marginTop: 0, opacity: 0 },
            leaveStyle: { marginTop: 40, opacity: 0 }
          })
        }}
      >
        Content
      </div>
    );
  } else {
    return null;
  }
});

class Dropdown extends Component {
  constructor() {
    super();
    this.state = { opened: false };
    this.toggle = this.toggle.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state !== nextState;
  }

  toggle() {
    this.setState(state => ({ opened: !state.opened }));
  }

  render() {
    return (
      <ReactFlipContainer defer debug>
        <div>
          <button onClick={this.toggle}>
            {this.state.opened ? 'Close' : 'Open'}
          </button>
          <Content show={this.state.opened} />
        </div>
      </ReactFlipContainer>
    );
  }
}

export default Dropdown;
