import React from 'react';
import { Route } from 'react-router-dom';
import Basic from './examples/basic/index.js';
import Dropdown from './examples/dropdown/index.js';
import PageTransition from './examples/page-transition/index.js';

const Example = props => (
  <Route path={props.path} render={({ match }) => props.children()} />
);

const Examples = () => (
  <div>
    <Example path="/basic">{() => <Basic />}</Example>
    <Example path="/dropdown">{() => <Dropdown />}</Example>
    <Example path="/page-transition">{() => <PageTransition />}</Example>
  </div>
);

export default Examples;
