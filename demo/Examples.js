import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Basic from './examples/basic/index.js';
import Dropdown from './examples/dropdown/index.js';
import PageTransition from './examples/page-transition/index.js';
import List from './examples/list/index.js';

const Example = props => (
  <Route path={props.path} render={({ match }) => props.children()} />
);

const Examples = () => (
  <main>
    <Switch>
      <Example path="/basic">{() => <Basic />}</Example>
      <Example path="/dropdown">{() => <Dropdown />}</Example>
      <Example path="/page-transition">{() => <PageTransition />}</Example>
      <Example path="/list">{() => <List />}</Example>
      <div
        dangerouslySetInnerHTML={{
          __html: `
        <p>
          <a target="_blank" href="https://github.com/JulienPradet/react-flip">react-flip</a>
          is an animation library based on
          <a href="https://github.com/facebook/react" target="_blank">React</a> and
          <a href="https://aerotwist.com/blog/flip-your-animations/" target="_blank">FLIP</a>.
        </p>

        <p>
          It is a set of low level components that will make your life easier
          when it comes to animating your content.
        </p>

        <p>
          For now, it's just a set of demos. The technical documentation will come soon.
          However, you can take a look at the examples' code to get a grasp of how it works.
          I also do try to document my commits. So if you're after implementation details,
          look at the git history.
        </p>

        <p>
          Feel free to open issues in the <a target="_blank" href="https://github.com/JulienPradet/react-flip">github repository</a>! :)
        </p>
      `
        }}
      />
    </Switch>
  </main>
);

export default Examples;
