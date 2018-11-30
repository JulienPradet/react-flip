import React, { Component } from "react";
import classnames from "classnames";
import Link from "react-router-dom/Link";
import ReactFlipElement from "../../../src/ReactFlipElement";
import { BEFORE_ANIMATION, ANIMATION } from "../../../src/ReactFlipContainer";
import { PageShape } from "./pages";

class PagePreview extends Component {
  render() {
    return (
      <ReactFlipElement>
        {({ status, setFlipElement }) => (
          <div
            ref={setFlipElement}
            options={{
              id: "preview_" + this.props.page.path
            }}
            className={classnames("page-preview", {
              "page-preview--fadeout": (status === BEFORE_ANIMATION &&
                this.props.isViewed) ||
                (status === ANIMATION && !this.props.isViewed)
            })}
          >
            <Link to={this.props.page.path}>{this.props.page.title}</Link>
          </div>
        )}
      </ReactFlipElement>
    );
  }
}

PagePreview.propTypes = {
  page: PageShape.isRequired
};

export default PagePreview;
