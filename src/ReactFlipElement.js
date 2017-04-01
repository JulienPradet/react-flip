import { Component, PropTypes } from 'react';
import ReactFlipContainer, { BEFORE_ANIMATION } from './ReactFlipContainer';

class ReactFlipElement extends Component {
  constructor() {
    super();
    this.setFlipElement = this.setFlipElement.bind(this);
    this.updateTarget = this.updateTarget.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  getOptions() {
    return this.props.options;
  }

  componentDidMount() {
    this.removeTarget = this.updateTarget();
  }

  componentDidUpdate() {
    if (
      this.context.flip.status() === BEFORE_ANIMATION && this.getOptions().defer
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
      options: this.getOptions
    });
  }

  render() {
    return this.props.children({
      setFlipElement: this.setFlipElement,
      status: this.context.flip.status()
    });
  }
}

ReactFlipElement.contextTypes = ReactFlipContainer.childContextTypes;

ReactFlipElement.propTypes = {
  options: PropTypes.object,
  children: PropTypes.func.isRequired
};

ReactFlipElement.defaultProps = {
  options: {}
};

export default ReactFlipElement;
