import React, { Component } from 'react';
import ReactFlipContainer, {
  BEFORE_ANIMATION,
  ANIMATION
} from '../../../src/ReactFlipContainer';
import ReactFlipElement from '../../../src/ReactFlipElement';

const List = props => <div>{props.children}</div>;

const Item = props => (
  <ReactFlipElement>
    {({ setFlipElement, status }) => {
      let style = {
        display: 'inline-block',
        padding: '0.5em'
      };
      if (status === BEFORE_ANIMATION && props.creating) {
        style.position = 'absolute';
        style.opacity = 0;
        style.marginTop = -10;
      } else if (status === ANIMATION && props.deleting) {
        style.position = 'absolute';
        style.opacity = 0;
        style.marginTop = 10;
      }
      return (
        <div style={style} ref={setFlipElement}>
          <button
            className="button-icon"
            title="Delete"
            onClick={props.onClick}
          >
            {props.children}
            <span className="icon">×</span>
          </button>
        </div>
      );
    }}
  </ReactFlipElement>
);

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
          </div>
        </ReactFlipContainer>
      </div>
    );
  }
}

export default Dropdown;
