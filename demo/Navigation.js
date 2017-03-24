import React from 'react';
import classnames from 'classnames';
import { Route, Link } from 'react-router-dom';

const NavigationLink = props => (
  <Route
    path={props.to}
    children={({ match }) => (
      <li className={classnames('nav')}>
        <Link to={props.to}>{props.children}</Link>
      </li>
    )}
  />
);

const Navigation = () => (
  <ul>
    <NavigationLink to="/basic">Basic</NavigationLink>
    <NavigationLink to="/dropdown">Dropdown</NavigationLink>
    <NavigationLink to="/page-transition">PageTransition</NavigationLink>
  </ul>
);

export default Navigation;
