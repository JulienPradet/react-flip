import React, { Component } from 'react';
import { ReactFlipContainer, ReactFlipElement } from '../../../src/index.js';

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
        <ReactFlipContainer>
          <div>
            <div className="button-sets">
              <button onClick={this.increment}>Bigger!</button>
              <button onClick={this.decrement}>Smaller!</button>
            </div>

            <ReactFlipElement>
              {({ setFlipElement }) => (
                <div
                  ref={setFlipElement}
                  style={{
                    height: this.state.height * 50,
                    width: '100%',
                    background: '#00C9C9'
                  }}
                />
              )}
            </ReactFlipElement>
          </div>
        </ReactFlipContainer>
      </div>
    );
  }
}

export default Basic;
