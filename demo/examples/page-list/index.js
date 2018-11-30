import React, { Component } from "react";
import withRouter from "react-router/withRouter";
import "./index.scss";
import pages from "./pages";
import PageListContainer from "./PageListContainer";

class ComplexTransition extends Component {
  constructor(props) {
    console.log("toto");
    super();
    this.state = {
      pages: pages(props.match.path)
    };
  }

  render() {
    return <PageListContainer pages={this.state.pages} />;
  }
}

export default withRouter(ComplexTransition);
