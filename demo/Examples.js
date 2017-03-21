import React from 'react';
import { Route } from 'react-router-dom';
import Basic from './examples/basic/index.js';
import Dropdown from './examples/dropdown/index.js';

const Example = props => (
  <Route path={props.path} render={({ match }) => props.children()} />
);

const Examples = () => (
  <ul>
    <Example path="/basic">{() => <Basic />}</Example>
    <Example path="/dropdown">{() => <Dropdown />}</Example>
  </ul>
);

export default Examples;
