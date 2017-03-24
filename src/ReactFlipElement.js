import React, { Component, PropTypes } from 'react';

const flipElement = (options = {}) =>
  BaseComponent => {
    class FlipElement extends Component {
      constructor(props, context) {
        super();
        this.setFlipElement = this.setFlipElement.bind(this);
        this.updateTarget = this.updateTarget.bind(this);

        if (process.env.NODE_ENV === 'development') {
          const defer = typeof options === 'function'
            ? () => options(this.props).defer
            : options.defer;
          if (defer && context.flip.defer() === false) {
            console.warn(
              'ReactFlipContainer is not in defer mode while the ReactFlipElement is. This most likely will run unexpected behaviors. Make sure to update your container with the `defer` prop.'
            );
          }
        }
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

        return this.context.flip.registerElement({
          element: this.element,
          options: typeof options === 'function'
            ? () => options(this.props)
            : options
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
        defer: PropTypes.func.isRequired,
        status: PropTypes.func.isRequired,
        registerElement: PropTypes.func.isRequired
      }).isRequired
    };

    return FlipElement;
  };

export default flipElement;
