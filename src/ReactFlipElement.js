import React, { Component, PropTypes } from 'react';
import { BEFORE_ANIMATION } from './ReactFlipContainer';

const flipElement = (options = {}) =>
  BaseComponent => {
    const getOptions = props =>
      typeof options === 'function' ? () => options(props) : options;

    class FlipElement extends Component {
      constructor() {
        super();
        this.setFlipElement = this.setFlipElement.bind(this);
        this.updateTarget = this.updateTarget.bind(this);
      }

      componentDidMount() {
        this.removeTarget = this.updateTarget();
      }

      componentDidUpdate() {
        if (
          this.context.flip.status() === BEFORE_ANIMATION &&
          getOptions(this.props).defer
        ) {
          if (this.removeTarget) this.removeTarget();
          this.removeTarget = this.updateTarget();
        }
      }

      componentWillUnmount() {
        if (this.removeTarget) this.removeTarget();
      }

      setFlipElement(element) {
        this.element = element;
      }

      updateTarget() {
        if (!this.element) return;

        return this.context.flip.registerElement({
          element: this.element,
          options: getOptions(this.props)
        });
      }

      render() {
        return (
          <BaseComponent
            flip={{
              setFlipElement: this.setFlipElement,
              status: this.context.flip.status()
            }}
            {...this.props}
          />
        );
      }
    }

    FlipElement.contextTypes = {
      flip: PropTypes.shape({
        status: PropTypes.func.isRequired,
        registerElement: PropTypes.func.isRequired
      }).isRequired
    };

    return FlipElement;
  };

export default flipElement;
