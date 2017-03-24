import React, { Component, PropTypes } from 'react';

const withFlipStatus = () =>
  BaseComponent => {
    class FlipElement extends Component {
      render() {
        return (
          <BaseComponent
            flip={{
              status: this.context.flip.status
            }}
            {...this.props}
          />
        );
      }
    }

    FlipElement.contextTypes = {
      flip: PropTypes.shape({
        status: PropTypes.func.isRequired
      }).isRequired
    };

    return FlipElement;
  };

export default withFlipStatus;
