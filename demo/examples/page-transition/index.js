import React, { Component } from 'react';
import withRouter from 'react-router/withRouter';
import Route from 'react-router/Route';
import Link from 'react-router-dom/Link';
import ReactFlipContainer from '../../../src/ReactFlipContainer';
import ReactFlipElement from '../../../src/ReactFlipElement';
import Page from './Page';

const pages = [
  {
    label: 'Page A',
    color: '#ff5680',
    path: pathname => pathname + '/a'
  },
  {
    label: 'Page B',
    color: '#4c3fff',
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
        <nav>
          <ul>
            {pages.map(page => (
              <li className="nav-link" key={page.path(this.props.match.path)}>
                <Link to={page.path(this.props.match.path)}>
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ReactFlipContainer defer>
          <div style={{ position: 'relative' }}>
            {pages.map(page => (
              <Route
                key={page.path(this.props.match.path)}
                path={page.path(this.props.match.path)}
                children={({ match }) => {
                  return (
                    <ReactFlipElement options={{ defer: true }}>
                      {flip => (
                        <Page match={match} color={page.color} flip={flip}>
                          {page.label}
                        </Page>
                      )}
                    </ReactFlipElement>
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
