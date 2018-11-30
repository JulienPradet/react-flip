import React, { PropTypes, Component } from "react";
import withRouter from "react-router/withRouter";
import Route from "react-router/Route";
import ReactFlipContainer from "../../../src/ReactFlipContainer";
import PageList from "./PageList";
import Page from "./Page";

class PageListContainer extends Component {
  render() {
    return (
      <ReactFlipContainer debug forceDefer onAnimationEnd={this.cleanUp}>
        {({ status }) => (
          <div className="page-list-container">
            <Route
              path={this.props.match.path}
              children={({ match }) => (
                <PageList
                  isViewed={Boolean(match && match.isExact)}
                  animationStatus={status}
                  pages={this.props.pages}
                />
              )}
            />
            {this.props.pages.map((page, index) => (
              <Route
                key={page.path}
                path={page.path}
                children={({ match }) => (
                  <Page
                    isViewed={Boolean(match && match.isExact)}
                    animationStatus={status}
                    page={page}
                  />
                )}
              />
            ))}
          </div>
        )}
      </ReactFlipContainer>
    );
  }
}

PageListContainer.propTypes = {
  pages: PropTypes.array.isRequired
};

export default withRouter(PageListContainer);
