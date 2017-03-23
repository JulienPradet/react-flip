import React, { Component, PropTypes } from 'react';

const flipElement = options =>
  BaseComponent => {
    class FlipElement extends Component {
      constructor() {
        super();
        this.setFlipElement = this.setFlipElement.bind(this);
        this.updateTarget = this.updateTarget.bind(this);
      }

      componentDidMount() {
        this.removeTarget = this.updateTarget();
      }

      componentWillUnmount() {
        this.removeTarget();
      }

      setFlipElement(element) {
        this.element = element;
      }

      updateTarget() {
        if (!this.element) return;

        return this.context.flip.registerElement(
          this.element,
          typeof options === 'function' ? () => options(this.props) : options
        );
      }

      render() {
        return (
          <BaseComponent
            flip={{ setFlipElement: this.setFlipElement }}
            {...this.props}
          />
        );
      }
    }

    FlipElement.contextTypes = {
      flip: PropTypes.shape({
        status: PropTypes.func.isRequired,
        defer: PropTypes.func.isRequired,
        registerElement: PropTypes.func.isRequired
      }).isRequired
    };

    return FlipElement;
  };

export default flipElement;
