import React, { Component, PropTypes } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/themes/prism-okaidia.css';

class Code extends Component {
  render() {
    return (
      <pre className={`language-${this.props.lang}`}>
        <code
          dangerouslySetInnerHTML={{
            __html: Prism.highlight(
              this.props.children,
              Prism.languages[this.props.lang]
            )
          }}
        />
      </pre>
    );
  }
}

Code.propTypes = {
  lang: PropTypes.string,
  children: PropTypes.node.isRequired
};
Code.defaultProps = {
  lang: 'jsx'
};

export default Code;
