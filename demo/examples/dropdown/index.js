import React, { Component } from "react";
import ReactFlipContainer, {
  ANIMATION,
  BEFORE_ANIMATION,
  STATIC
} from "../../../src/ReactFlipContainer";
import ReactFlipElement from "../../../src/ReactFlipElement";

const statusToStyleCreator = {
  [ANIMATION]: (props, options) => (props.show ? {} : options.leaveStyle),
  [BEFORE_ANIMATION]: (props, options) =>
    props.show ? options.enterStyle : {},
  [STATIC]: (props, options) => ({})
};

const Content = props => (
  <ReactFlipElement options={{ defer: true }}>
    {({ setFlipElement, status }) => {
      if (props.show || status !== STATIC) {
        return (
          <div
            ref={setFlipElement}
            style={{
              border: "1px solid #00c9c9",
              padding: "1em",
              width: "100%",
              ...statusToStyleCreator[status](props, {
                enterStyle: {
                  position: "absolute",
                  top: -40,
                  opacity: 0,
                  transform: "scale(1, 0.5)"
                },
                leaveStyle: {
                  position: "absolute",
                  top: -40,
                  opacity: 0,
                  transform: "scale(1, 0.5)"
                }
              })
            }}
          >
            Content
          </div>
        );
      } else {
        return null;
      }
    }}
  </ReactFlipElement>
);

class Dropdown extends Component {
  constructor() {
    super();
    this.state = { opened: false };
    this.toggle = this.toggle.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state !== nextState;
  }

  toggle() {
    this.setState(state => ({ opened: !state.opened }));
  }

  render() {
    return (
      <ReactFlipContainer forceDefer debug>
        <div>
          <div className="button-sets button-sets--full">
            <button onClick={this.toggle}>
              {this.state.opened ? "Close" : "Open"}
            </button>
          </div>
          <div style={{ position: "relative" }}>
            <Content show={this.state.opened} />
          </div>
        </div>
      </ReactFlipContainer>
    );
  }
}

export default Dropdown;
