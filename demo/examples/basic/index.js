import React, { Component } from 'react';
import { ReactFlipContainer, ReactFlipElement } from '../../../src/index.js';
import Code from '../../util/Code.js';
import rawCode from './index.js?raw';

const Element = ReactFlipElement()(props => (
  <div
    ref={props.flip.setFlipElement}
    style={{
      height: props.height * 50,
      width: '100%',
      background: '#00C9C9'
    }}
  />
));

const CodeView = ReactFlipElement()(props => (
  <div ref={props.flip.setFlipElement}>
    <Code>{props.children}</Code>
  </div>
));

class Basic extends Component {
  constructor() {
    super();
    this.state = {
      height: 1
    };
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
  }

  increment() {
    this.setState(state => ({ height: Math.min(20, state.height + 1) }));
  }
  decrement() {
    this.setState(state => ({ height: Math.max(1, state.height - 1) }));
  }

  render() {
    return (
      <div>
        <ReactFlipContainer debug>
          <div>
            <div className="button-sets">
              <button onClick={this.increment}>Bigger!</button>
              <button onClick={this.decrement}>Smaller!</button>
            </div>
            <Element height={this.state.height} />
            <CodeView>{rawCode}</CodeView>
          </div>
        </ReactFlipContainer>
      </div>
    );
  }
}

export default Basic;
