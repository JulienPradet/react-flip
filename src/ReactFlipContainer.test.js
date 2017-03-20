import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ReactFlipContainer from './ReactFlipContainer';
import ReactFlipElement from './ReactFlipElement';
import FlipGroup from './FlipGroup';

jest.mock('./FlipGroup');

const ReflessElement = ReactFlipElement({})(props => (
  <div>
    Element
  </div>
));

const Element = ReactFlipElement({})(props => (
  <div ref={props.flip.setFlipElement}>
    Element
  </div>
));

class Wrapper extends Component {
  constructor() {
    super();
    this.state = { opened: false };
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState(state => ({ opened: !state.opened }));
  }
  render() {
    return (
      <ReactFlipContainer>
        {({ animating }) => (
          <div>
            {animating ? 'Animated' : 'Static'}
            <Element />
          </div>
        )}
      </ReactFlipContainer>
    );
  }
}

describe('ReactFlipContainer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('The container should render its children', () => {
    const tree = shallow(
      <ReactFlipContainer>
        {({ animating }) => (
          <div>
            {animating ? 'Animated' : 'Static'}
            Content
          </div>
        )}
      </ReactFlipContainer>
    );
    expect(toJson(tree)).toMatchSnapshot();
  });

  test('Should allow children to register to flip group', () => {
    const Element = ReactFlipElement({})(props => (
      <div ref={props.flip.setFlipElement}>
        Element
      </div>
    ));

    const tree = mount(
      <ReactFlipContainer>
        {({ animating }) => (
          <div>
            {animating ? 'Animated' : 'Static'}
            <Element />
          </div>
        )}
      </ReactFlipContainer>
    );

    expect(FlipGroup.prototype.addElement.mock.calls.length).toBe(1);
  });

  test('Should not register children if the ref is not defined', () => {
    const tree = mount(
      <ReactFlipContainer>
        {({ animating }) => (
          <div>
            {animating ? 'Animated' : 'Static'}
            <ReflessElement />
          </div>
        )}
      </ReactFlipContainer>
    );

    expect(FlipGroup.prototype.addElement.mock.calls.length).toBe(0);
  });

  test('Should call first, last and invert on update, but not play if invert returned false', () => {
    const tree = mount(<Wrapper />);
    tree.instance().toggle();

    expect({
      first: FlipGroup.prototype.first.mock.calls.length,
      last: FlipGroup.prototype.last.mock.calls.length,
      invert: FlipGroup.prototype.invert.mock.calls.length,
      play: FlipGroup.prototype.play.mock.calls.length
    }).toEqual({
      first: 1,
      last: 1,
      invert: 1,
      play: 0
    });
  });

  test('Should call first, last and invert on update, and play if invert returned true', () => {
    FlipGroup.prototype.invert.mockImplementation(() => true);

    const tree = mount(<Wrapper />);
    tree.instance().toggle();

    expect({
      first: FlipGroup.prototype.first.mock.calls.length,
      last: FlipGroup.prototype.last.mock.calls.length,
      invert: FlipGroup.prototype.invert.mock.calls.length,
      play: FlipGroup.prototype.play.mock.calls.length
    }).toEqual({
      first: 1,
      last: 1,
      invert: 1,
      play: 1
    });
  });

  test('Should render as animating if play returned a promise', () => {
    FlipGroup.prototype.invert.mockImplementation(() => true);
    FlipGroup.prototype.play.mockImplementation(() => new Promise(() => {}));

    const tree = mount(<Wrapper />);
    tree.instance().toggle();

    expect(toJson(tree)).toMatchSnapshot();
  });

  test('Should render back as static if the play promise was resolved', () => {
    let externalResolve;
    FlipGroup.prototype.invert.mockImplementation(() => true);
    FlipGroup.prototype.play.mockImplementation(
      () => new Promise(resolve => externalResolve = resolve)
    );

    const tree = mount(<Wrapper />);
    tree.instance().toggle();
    externalResolve();

    return new Promise(resolve => {
      setTimeout(
        () => {
          expect(toJson(tree)).toMatchSnapshot();
          resolve();
        },
        0
      );
    });
  });

  test('Should remove an element the FlipGroup on unmount', () => {
    const removeMock = jest.fn();
    FlipGroup.prototype.addElement.mockImplementation(() => removeMock);

    class Wrapper extends Component {
      constructor() {
        super();
        this.state = { opened: true };
        this.close = this.close.bind(this);
      }
      close() {
        this.setState({ opened: false });
      }
      render() {
        return (
          <ReactFlipContainer>
            {({ animating }) => (
              <div>
                {this.state.opened && <Element />}
              </div>
            )}
          </ReactFlipContainer>
        );
      }
    }
    const tree = mount(<Wrapper />);
    tree.instance().close();

    expect(removeMock.mock.calls.length).toBe(1);
  });
});
