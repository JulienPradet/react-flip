import React, { Component } from 'react';
import ReactFlipContainer, {
  BEFORE_ANIMATION,
  ANIMATION
} from '../../../src/ReactFlipContainer';
import ReactFlipElement from '../../../src/ReactFlipElement';

const List = props => <div>{props.children}</div>;
const Item = ReactFlipElement()(
  class Item extends Component {
    render() {
      let style = {
        display: 'inline-block',
        padding: '0.5em'
      };
      if (this.props.flip.status === BEFORE_ANIMATION && this.props.creating) {
        style.position = 'absolute';
        style.opacity = 0;
        style.marginTop = -10;
      } else if (this.props.flip.status === ANIMATION && this.props.deleting) {
        style.position = 'absolute';
        style.opacity = 0;
        style.marginTop = 10;
      }
      return (
        <div
          style={style}
          ref={this.props.flip.setFlipElement}
          onClick={this.props.onClick}
        >
          {this.props.children}
        </div>
      );
    }
  }
);

class Dropdown extends Component {
  constructor() {
    super();
    this.state = { list: [], createItem: null, removeItem: null };
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
      list: state.list.reverse()
    }));
  }

  sort() {
    this.setState(state => ({
      list: state.list.sort((a, b) => a - b)
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
        list: [...state.list.filter(value => value !== state.removeItem)]
      };
    });
  }

  isInteractive() {
    return this.state.createItem === null && this.state.removeItem === null;
  }

  render() {
    return (
      <div>
        <button onClick={this.isInteractive() && this.reverse}>
          Reverse
        </button>
        <button onClick={this.isInteractive() && this.sort}>
          Sort
        </button>
        <button onClick={this.isInteractive() && this.add}>
          Add
        </button>
        <ReactFlipContainer
          onAnimationEnd={this.cleanUp}
          forceDefer={
            this.state.createItem !== null || this.state.removeItem !== null
          }
          debug
        >
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
        </ReactFlipContainer>
      </div>
    );
  }
}

export default Dropdown;
