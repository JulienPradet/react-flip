import React, { PropTypes } from "react";
import withRouter from "react-router/withRouter";
import { BEFORE_ANIMATION, ANIMATION } from "../../../src/ReactFlipContainer";
import PagePreview from "./PagePreview";

class PageList extends React.Component {
  render() {
    return this.props.isViewed ||
      [BEFORE_ANIMATION, ANIMATION].indexOf(this.props.animationStatus) > -1
      ? <div className="page-list">
          {this.props.pages.map(page => (
            <PagePreview
              key={page.path}
              isViewed={this.props.isViewed}
              page={page}
            />
          ))}
        </div>
      : null;
  }
}

PageList.propTypes = {
  pages: PropTypes.array.isRequired
};

export default withRouter(PageList);
