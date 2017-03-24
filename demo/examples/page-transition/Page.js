import React, { Component } from 'react';
import ReactFlipElement from '../../../src/ReactFlipElement';
import { STATIC, BEFORE_ANIMATION } from '../../../src/ReactFlipContainer';

class Page extends Component {
  render() {
    if (!this.props.match && this.props.flip.status === STATIC) {
      return null;
    }

    return (
      <div
        ref={this.props.flip.setFlipElement}
        style={{
          background: this.props.color,
          color: 'white',
          fontWeight: 'bold',
          padding: '2em',
          width: '100%',
          boxSizing: 'border-box',
          opacity: this.props.match
            ? this.props.flip.status === BEFORE_ANIMATION ? 0 : 1
            : this.props.flip.status === BEFORE_ANIMATION ? 1 : 0,
          position: this.props.flip.status === STATIC ? 'static' : 'absolute',
          top: this.props.flip.status === STATIC ? 'auto' : 0,
          left: this.props.match
            ? this.props.flip.status === BEFORE_ANIMATION ? '-100%' : 0
            : this.props.flip.status === BEFORE_ANIMATION ? 0 : '100%'
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default ReactFlipElement({ defer: true })(Page);
