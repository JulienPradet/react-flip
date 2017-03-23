import React, { Component } from 'react';
import { ReactFlipContainer, ReactFlipElement } from '../../../src/index.js';

const Element = ReactFlipElement(props => ({
  delay: props.delay,
  duration: props.duration
}))(props => (
  <div
    ref={props.flip.setFlipElement}
    style={{
      height: props.height * 50,
      width: '100%',
      background: '#00C9C9'
    }}
  />
));

class Basic extends Component {
  constructor() {
    super();
    this.state = {
      delay: 0,
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
        Basics
        <ReactFlipContainer>
          {() => (
            <div>
              <button onClick={this.increment}>Bigger!</button>
              <button onClick={this.decrement}>Smaller!</button>
              <Element
                height={this.state.height}
                delay={this.state.delay}
                duration={this.state.duration}
              />
            </div>
          )}
        </ReactFlipContainer>
      </div>
    );
  }
}

export default Basic;