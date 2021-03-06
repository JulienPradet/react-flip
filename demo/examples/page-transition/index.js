import React, { Component } from 'react';
import withRouter from 'react-router/withRouter';
import Route from 'react-router/Route';
import Link from 'react-router-dom/Link';
import ReactFlipContainer from '../../../src/ReactFlipContainer';
import ReactFlipElement from '../../../src/ReactFlipElement';
import Page from './Page';
import Code from '../../util/Code';
import rawCode from './index.js?raw';
import pageRawCode from './Page.js?raw';

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

const CodeView = ReactFlipElement()(props => (
  <div ref={props.flip.setFlipElement}>
    <Code>{props.children}</Code>
  </div>
));

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
                    <Page match={match} color={page.color}>{page.label}</Page>
                  );
                }}
              />
            ))}
            <CodeView>{rawCode}</CodeView>
            <CodeView>{pageRawCode}</CodeView>
          </div>
        </ReactFlipContainer>
      </div>
    );
  }
}

export default withRouter(PageTransition);
