import React, { Component } from 'react';
import withRouter from 'react-router/withRouter';
import Route from 'react-router/Route';
import Link from 'react-router-dom/Link';
import ReactFlipContainer from '../../../src/ReactFlipContainer';
// import ReactFlipElement from '../../../src/ReactFlipElement';
import Page from './Page';

const pages = [
  {
    label: 'Page A',
    color: 'red',
    path: pathname => pathname + '/a'
  },
  {
    label: 'Page B',
    color: 'blue',
    path: pathname => pathname + '/b'
  }
];

class PageTransition extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.location.pathname !== this.props.location.pathname;
  }
  render() {
    return (
      <div>
        <div>
          {pages.map(page => (
            <Link
              key={page.path(this.props.match.path)}
              to={page.path(this.props.match.path)}
            >
              {page.label}
            </Link>
          ))}
        </div>
        <ReactFlipContainer defer>
          <div style={{ position: 'relative' }}>
            {pages.map(page => (
              <Route
                key={page.path(this.props.match.path)}
                path={page.path(this.props.match.path)}
                children={({ match }) => {
                  return (
                    <Page match={match} color={page.color}>{page.label}</Page>
                  );
                }}
              />
            ))}
          </div>
        </ReactFlipContainer>
      </div>
    );
  }
}

export default withRouter(PageTransition);
