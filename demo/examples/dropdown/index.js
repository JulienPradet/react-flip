import React, { Component } from 'react';
import ReactFlipContainer, {
  ANIMATION,
  BEFORE_ANIMATION,
  STATIC
} from '../../../src/ReactFlipContainer';
import ReactFlipElement from '../../../src/ReactFlipElement';
import Code from '../../util/Code';
import rawCode from './index.js?raw';

const statusToStyleCreator = {
  [ANIMATION]: (props, options) => props.show ? {} : options.leaveStyle,
  [BEFORE_ANIMATION]: (props, options) => props.show ? options.enterStyle : {},
  [STATIC]: (props, options) => ({})
};

const Content = ReactFlipElement({ defer: true, updateScale: false })(props => {
  if (props.show || props.flip.status !== STATIC) {
    return (
      <div
        ref={props.flip.setFlipElement}
        style={{
          border: '1px solid #00c9c9',
          padding: '1em',
          width: '100%',
          ...statusToStyleCreator[props.flip.status](props, {
            enterStyle: { position: 'absolute', top: -40, opacity: 0 },
            leaveStyle: { position: 'absolute', top: -40, opacity: 0 }
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

const CodeView = ReactFlipElement()(props => (
  <div ref={props.flip.setFlipElement}>
    <Code>{props.children}</Code>
  </div>
));

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
      <ReactFlipContainer defer>
        <div>
          <div className="button-sets button-sets--full">
            <button onClick={this.toggle}>
              {this.state.opened ? 'Close' : 'Open'}
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <Content show={this.state.opened} />
          </div>
          <CodeView>{rawCode}</CodeView>
        </div>
      </ReactFlipContainer>
    );
  }
}

export default Dropdown;
