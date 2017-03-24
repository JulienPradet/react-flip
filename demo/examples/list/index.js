import React, { Component } from 'react';
import ReactFlipContainer, {
  BEFORE_ANIMATION,
  ANIMATION
} from '../../../src/ReactFlipContainer';
import ReactFlipElement from '../../../src/ReactFlipElement';
import Code from '../../util/Code';
import rawCode from './index.js?raw';

const List = props => <div>{props.children}</div>;

const Item = ReactFlipElement()(props => {
  let style = {
    display: 'inline-block',
    padding: '0.5em'
  };
  if (props.flip.status === BEFORE_ANIMATION && props.creating) {
    style.position = 'absolute';
    style.opacity = 0;
    style.marginTop = -10;
  } else if (props.flip.status === ANIMATION && props.deleting) {
    style.position = 'absolute';
    style.opacity = 0;
    style.marginTop = 10;
  }
  return (
    <div style={style} ref={props.flip.setFlipElement}>
      <button className="button-icon" title="Delete" onClick={props.onClick}>
        {props.children}
        <span className="icon">×</span>
      </button>
    </div>
  );
});

const CodeView = ReactFlipElement()(props => (
  <div ref={props.flip.setFlipElement}>
    <Code>{props.children}</Code>
  </div>
));

class Dropdown extends Component {
  constructor() {
    super();
    this.state = {
      list: [],
      createItem: null,
      removeItem: null,
      reorder: false
    };
    this.reverse = this.reverse.bind(this);
    this.add = this.add.bind(this);
    this.sort = this.sort.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state !== nextState;
  }

  reverse() {
    this.setState(state => ({
      list: state.list.reverse(),
      reorder: true
    }));
  }

  sort() {
    this.setState(state => ({
      list: state.list.sort((a, b) => a - b),
      reorder: true
    }));
  }

  add() {
    this.setState(state => {
      const index = Math.floor(state.list.length * Math.random());
      const value = Math.ceil(Math.random() * 1000);
      return {
        list: [
          ...state.list.slice(0, index),
          value,
          ...state.list.slice(index)
        ],
        createItem: value
      };
    });
  }

  remove(item) {
    this.setState({
      removeItem: item
    });
  }

  cleanUp() {
    this.setState(state => {
      return {
        createItem: null,
        removeItem: null,
        reorder: false,
        list: [...state.list.filter(value => value !== state.removeItem)]
      };
    });
  }

  isInteractive() {
    return this.state.createItem === null &&
      this.state.removeItem === null &&
      !this.state.reorder;
  }

  render() {
    return (
      <div>
        <div className="button-sets">
          <button onClick={this.isInteractive() && this.add}>
            Add
          </button>
          <button onClick={this.isInteractive() && this.sort}>
            Sort
          </button>
          <button onClick={this.isInteractive() && this.reverse}>
            Reverse
          </button>
        </div>
        <ReactFlipContainer
          shouldAnimate={
            this.state.createItem || this.state.removeItem || this.state.reorder
          }
          onAnimationEnd={this.cleanUp}
          forceDefer={
            this.state.createItem !== null || this.state.removeItem !== null
          }
        >
          <div>
            <List>
              {this.state.list.map(item => (
                <Item
                  key={item}
                  creating={this.state.createItem === item}
                  deleting={this.state.removeItem === item}
                  onClick={this.isInteractive() && this.remove.bind(this, item)}
                >
                  {item}
                </Item>
              ))}
            </List>
            <CodeView>{rawCode}</CodeView>
          </div>
        </ReactFlipContainer>
      </div>
    );
  }
}

export default Dropdown;
