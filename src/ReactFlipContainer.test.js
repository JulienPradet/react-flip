import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ReactFlipContainer, { STATIC } from './ReactFlipContainer';
import ReactFlipElement from './ReactFlipElement';
import FlipGroup from './FlipGroup';

jest.mock('./FlipGroup');

const ReflessElement = ReactFlipElement({})(props => (
  <div>
    Element
  </div>
));

const Element = ReactFlipElement()(props => (
  <div ref={props.flip.setFlipElement}>
    Element
  </div>
));

const DeferredElement = ReactFlipElement({ defer: true })(props => (
  <div ref={props.flip.setFlipElement}>
    Element
  </div>
));

class Wrapper extends Component {
  constructor(props) {
    super();
    this.state = { opened: props.initiallyOpened || false };
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState(state => ({ opened: !state.opened }));
  }
  render() {
    const RenderedElement = this.props.Element || Element;
    return (
      <ReactFlipContainer
        shouldAnimate={this.props.shouldAnimate}
        {...this.props}
      >
        <div>
          <RenderedElement opened={this.state.opened} />
        </div>
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
        <div>
          Content
        </div>
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
        <div>
          <Element />
        </div>
      </ReactFlipContainer>
    );

    expect(FlipGroup.prototype.addElement.mock.calls.length).toBe(1);
  });

  test('Should not register children if the ref is not defined', () => {
    const tree = mount(
      <ReactFlipContainer>
        <div>
          <ReflessElement />
        </div>
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

  test('Should not animate if shouldAnimate is false', () => {
    FlipGroup.prototype.invert.mockImplementation(() => true);
    FlipGroup.prototype.play.mockImplementation(() => new Promise(() => {}));

    const tree = mount(<Wrapper shouldAnimate={false} />);
    tree.instance().toggle();

    expect(toJson(tree)).toMatchSnapshot();
  });

  test('Should animate if shouldAnimate is true', () => {
    FlipGroup.prototype.invert.mockImplementation(() => true);
    FlipGroup.prototype.play.mockImplementation(() => new Promise(() => {}));

    const tree = mount(<Wrapper shouldAnimate={true} />);
    tree.instance().toggle();

    expect(toJson(tree)).toMatchSnapshot();
  });

  test('Should not animate if shouldAnimate is a function that returns false', () => {
    FlipGroup.prototype.invert.mockImplementation(() => true);
    FlipGroup.prototype.play.mockImplementation(() => new Promise(() => {}));

    const tree = mount(<Wrapper shouldAnimate={props => false} />);
    tree.instance().toggle();

    expect(toJson(tree)).toMatchSnapshot();
  });

  test('Should animate if shouldAnimate is a function that returns true', () => {
    FlipGroup.prototype.invert.mockImplementation(() => true);
    FlipGroup.prototype.play.mockImplementation(() => new Promise(() => {}));

    const tree = mount(<Wrapper shouldAnimate={props => true} />);
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
            <div>
              {this.state.opened && <Element />}
            </div>
          </ReactFlipContainer>
        );
      }
    }
    const tree = mount(<Wrapper />);
    tree.instance().close();

    expect(removeMock.mock.calls.length).toBe(1);
  });

  test('Should remove an element the FlipGroup on unmount', () => {
    const mockOptions = jest.fn();
    mockOptions.mockImplementation(() => ({}));

    const Element = ReactFlipElement(mockOptions)(props => (
      <div ref={props.flip.setFlipElement}>
        Element
      </div>
    ));

    const Wrapper = () => (
      <ReactFlipContainer>
        <div>
          <Element props="test" />
        </div>
      </ReactFlipContainer>
    );

    const tree = mount(<Wrapper />);

    expect(
      typeof FlipGroup.prototype.addElement.mock.calls[0][0].optionCreator
    ).toBe('function');
  });

  test('Should FLI the non deferred elements first and then update the deferred ones', () => {
    FlipGroup.prototype.invert.mockImplementation(() => true);

    const tree = mount(<Wrapper defer />);
    tree.instance().toggle();

    expect({
      first: FlipGroup.prototype.first.mock.calls,
      last: FlipGroup.prototype.last.mock.calls,
      invert: FlipGroup.prototype.invert.mock.calls,
      play: FlipGroup.prototype.play.mock.calls
    }).toEqual({
      first: [[{ deferred: false }], [{ deferred: true }]],
      last: [[{ deferred: false }], [{ deferred: undefined }]],
      invert: [[{ deferred: false }], [{ deferred: undefined }]],
      play: [[]]
    });
  });

  test('Should defer all elements when forceDefer option is used', () => {
    FlipGroup.prototype.invert.mockImplementation(() => true);

    const tree = mount(<Wrapper forceDefer />);
    tree.instance().toggle();

    expect({
      first: FlipGroup.prototype.first.mock.calls,
      last: FlipGroup.prototype.last.mock.calls,
      invert: FlipGroup.prototype.invert.mock.calls,
      play: FlipGroup.prototype.play.mock.calls
    }).toEqual({
      first: [[{ deferred: undefined }]],
      last: [[{ deferred: undefined }]],
      invert: [[{ deferred: undefined }]],
      play: [[]]
    });
  });

  test('Should render back as static even with deferred elements', () => {
    let externalResolve;
    let removeMock = jest.fn();
    FlipGroup.prototype.addElement.mockImplementation(() => removeMock);
    FlipGroup.prototype.invert.mockImplementation(() => true);
    FlipGroup.prototype.play.mockImplementation(
      () => new Promise(resolve => externalResolve = resolve)
    );

    const tree = mount(<Wrapper defer Element={DeferredElement} />);
    tree.instance().toggle();

    expect({
      addElement: FlipGroup.prototype.addElement.mock.calls.length,
      removeElement: removeMock.mock.calls.length
    }).toEqual({
      addElement: 2,
      removeElement: 1
    });
  });

  test('Should add Element on update even if it was not there at first', () => {
    let externalResolve;
    let removeMock = jest.fn();
    FlipGroup.prototype.addElement.mockImplementation(() => removeMock);
    FlipGroup.prototype.invert.mockImplementation(() => true);
    FlipGroup.prototype.play.mockImplementation(
      () => new Promise(resolve => externalResolve = resolve)
    );

    const DeferredElement = ReactFlipElement({ defer: true })(props => {
      if (!props.opened && props.flip.status === STATIC) {
        return null;
      }

      return (
        <div ref={props.flip.setFlipElement}>
          Element
        </div>
      );
    });

    const tree = mount(<Wrapper defer Element={DeferredElement} />);
    tree.instance().toggle();

    expect({
      addElement: FlipGroup.prototype.addElement.mock.calls.length,
      removeElement: removeMock.mock.calls.length
    }).toEqual({
      addElement: 1,
      removeElement: 0
    });
  });

  test('Should not crash when removing an Element that was not registered in the first place', () => {
    let externalResolve;
    let removeMock = jest.fn();
    FlipGroup.prototype.addElement.mockImplementation(() => removeMock);
    FlipGroup.prototype.invert.mockImplementation(() => true);
    FlipGroup.prototype.play.mockImplementation(
      () => new Promise(resolve => externalResolve = resolve)
    );

    const DeferredElement = ReactFlipElement({ defer: true })(props => {
      if (!props.opened && props.flip.status === STATIC) {
        return null;
      }

      return (
        <div ref={props.flip.setFlipElement}>
          Element
        </div>
      );
    });

    const tree = mount(
      <Wrapper defer initiallyOpened={false} Element={DeferredElement} />
    );
    tree.unmount();
    expect(FlipGroup.prototype.addElement.mock.calls.length).toBe(0);
  });

  test('Should accept options in their function form and the resulting defer should be a function too', () => {
    let externalResolve;

    let optionMock = jest.fn();
    optionMock.mockImplementation(() => ({
      defer: true
    }));

    FlipGroup.prototype.addElement.mockImplementation((element, defer) => {
      expect(defer()).toBe(true);
    });

    const DeferredElement = ReactFlipElement(optionMock)(props => {
      return (
        <div ref={props.flip.setFlipElement}>
          Element
        </div>
      );
    });

    const tree = mount(<Wrapper defer Element={DeferredElement} />);
    tree.instance().toggle();
  });
});
