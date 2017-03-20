import React from 'react';

const flipElement = (options = {}) =>
  BaseComponent => {
    class FlipElement extends React.Component {
      constructor() {
        super();
        this.setFlipElement = this.setFlipElement.bind(this);
        this.updateTarget = this.updateTarget.bind(this);
        this.state = { animating: false };
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
        return this.context.flip.registerElement(this.element, options);
      }

      render() {
        return (
          <BaseComponent
            flip={{ setFlipElement: this.setFlipElement }}
            animating={this.state.animating}
            {...this.props}
          />
        );
      }
    }

    FlipElement.contextTypes = {
      flip: React.PropTypes.shape({
        registerElement: React.PropTypes.func.isRequired
      }).isRequired
    };

    return FlipElement;
  };

export default flipElement;
