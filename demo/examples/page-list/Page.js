import React, { Component } from "react";
import Link from "react-router-dom/Link";
import { STATIC } from "../../../src/ReactFlipContainer";

class Page extends Component {
  render() {
    return this.props.isViewed && this.props.animationStatus === STATIC
      ? <div className="page">
          <div className="page__close">
            <Link to=".">×</Link>
          </div>
          <div className="page__title">
            {this.props.page.title}
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: this.props.page.description }}
          />
        </div>
      : null;
  }
}

Page.propTypes = {};

export default Page;
