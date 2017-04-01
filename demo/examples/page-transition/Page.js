import React, { Component } from 'react';
import { STATIC, BEFORE_ANIMATION } from '../../../src/ReactFlipContainer';

class Page extends Component {
  componentDidMount() {
    if (this.node) {
      this.lastHeight = this.node.clientHeight;
    }
  }
  componentDidUpdate() {
    if (this.node) {
      this.lastHeight = this.node.clientHeight;
    }
  }
  render() {
    if (!this.props.match && this.props.flip.status === STATIC) {
      this.previousRenderMatched = false;
      return null;
    }

    if (!this.props.match && !this.previousRenderMatched) {
      this.previousRenderMatched = false;
      return null;
    }

    this.previousRenderMatched = true;
    return (
      <div
        style={{
          minHeight: this.props.match
            ? this.props.flip.status === BEFORE_ANIMATION ? 0 : this.lastHeight
            : this.props.flip.status === BEFORE_ANIMATION ? this.lastHeight : 0
        }}
      >
        <div
          ref={node => {
            this.node = node;
            this.props.flip.setFlipElement(node);
          }}
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
      </div>
    );
  }
}

export default Page;
