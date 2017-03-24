import React, { Component } from 'react';
import ReactFlipContainer, { BEFORE_ANIMATION } from './ReactFlipContainer';

const ReactFlipElement = (options = {}) =>
  BaseComponent => {
    const getOptions = props =>
      typeof options === 'function' ? () => options(props) : options;

    class ReactFlipElement extends Component {
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

    ReactFlipElement.contextTypes = ReactFlipContainer.childContextTypes;

    return ReactFlipElement;
  };

export default ReactFlipElement;
