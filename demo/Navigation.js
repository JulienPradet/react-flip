import React from 'react';
import classnames from 'classnames';
import { Route, Link } from 'react-router-dom';

const NavigationLink = props => (
  <Route
    path={props.to}
    children={({ match }) => (
      <li
        className={classnames('nav-link', {
          'nav-link--active': Boolean(match)
        })}
      >
        <Link to={props.to}>{props.children}</Link>
      </li>
    )}
  />
);

const Navigation = () => (
  <nav>
    <h1>
      <Link to="/">react-flip</Link>
    </h1>
    <ul>
      <NavigationLink to="/basic">Basic</NavigationLink>
      <NavigationLink to="/dropdown">Dropdown</NavigationLink>
      <NavigationLink to="/list">List</NavigationLink>
      <NavigationLink to="/page-transition">Page Transition</NavigationLink>
      <NavigationLink to="/complex-transition">
        Complex Transition
      </NavigationLink>
    </ul>
  </nav>
);

export default Navigation;
