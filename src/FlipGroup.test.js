import Flip from './Flip';
import FlipGroup from './FlipGroup';
jest.mock('./Flip');
Flip.mockImplementation();

describe('FlipGroup', () => {
  test("It shouldn't be possible to add elements which are not Flip instances", () => {
    const element = 2;
    const group = new FlipGroup();
    group.addElement(element);
    expect(group.elements.length).toBe(0);
  });

  test('It should be possible to add a Flip element', () => {
    const element = new Flip();
    const group = new FlipGroup();
    group.addElement(element);
    expect(group.elements.length).toBe(1);
  });

  test('It should be possible to remove a Flip element', () => {
    const element = new Flip();
    const group = new FlipGroup();
    const remove = group.addElement(element);
    remove();
    expect(group.elements.length).toBe(0);
  });

  test('It should be possible to add a deferred Flip element using a function', () => {
    const element = new Flip();
    const group = new FlipGroup();
    const remove = group.addElement(element, () => true);
    expect(group.getConcernedElements(true).length).toBe(1);
  });

  test('It should be possible to add a deferred Flip element', () => {
    const element = new Flip();
    const group = new FlipGroup();
    const remove = group.addElement(element, true);
    expect(group.getConcernedElements(true).length).toBe(1);
  });

  test('It should be possible to remove a deferred Flip element', () => {
    const element = new Flip();
    const group = new FlipGroup();
    const remove = group.addElement(element, true);
    remove();
    expect(group.getConcernedElements(true).length).toBe(0);
  });

  test('First method on a group should call it on children', () => {
    const element = new Flip();
    const group = new FlipGroup();
    group.addElement(element);
    group.first();
    expect(element.first.mock.calls.length).toBe(1);
  });

  test('First method on a group should only call the deferred elements if deferred option is true', () => {
    const element = new Flip();
    const deferredElement = new Flip();
    const group = new FlipGroup();
    group.addElement(element);
    group.addElement(deferredElement, true);
    group.first({ deferred: true });
    expect(element.first.mock.calls.length).toBe(0);
    expect(deferredElement.first.mock.calls.length).toBe(1);
  });

  test('First method on a group should only call the non deferred elements if deferred option is false', () => {
    const element = new Flip();
    const deferredElement = new Flip();
    const group = new FlipGroup();
    group.addElement(element);
    group.addElement(deferredElement, true);
    group.first({ deferred: false });
    expect(element.first.mock.calls.length).toBe(1);
    expect(deferredElement.first.mock.calls.length).toBe(0);
  });

  test('Last method on a group should call it on children', () => {
    const element = new Flip();
    const group = new FlipGroup();
    group.addElement(element);
    group.last();
    expect(element.last.mock.calls.length).toBe(1);
  });

  test('Last method on a group should only call the deferred elements if deferred option is true', () => {
    const element = new Flip();
    const deferredElement = new Flip();
    const group = new FlipGroup();
    group.addElement(element);
    group.addElement(deferredElement, true);
    group.last({ deferred: true });
    expect(element.last.mock.calls.length).toBe(0);
    expect(deferredElement.last.mock.calls.length).toBe(1);
  });

  test('Last method on a group should only call the non deferred elements if deferred option is false', () => {
    const element = new Flip();
    const deferredElement = new Flip();
    const group = new FlipGroup();
    group.addElement(element);
    group.addElement(deferredElement, true);
    group.last({ deferred: false });
    expect(element.last.mock.calls.length).toBe(1);
    expect(deferredElement.last.mock.calls.length).toBe(0);
  });

  test('Invert method on a group should call it on children', () => {
    const element = new Flip();
    const group = new FlipGroup();
    group.addElement(element);
    group.first();
    group.last();
    group.invert();
    expect(element.invert.mock.calls.length).toBe(1);
  });

  test('Invert method on a group should call it on children', () => {
    const element = new Flip();
    const deferredElement = new Flip();
    const group = new FlipGroup();
    group.addElement(element);
    group.addElement(deferredElement, true);
    group.first();
    group.last();
    group.invert({ deferred: false });
    expect(element.invert.mock.calls.length).toBe(1);
    expect(deferredElement.invert.mock.calls.length).toBe(0);
  });

  test('Invert method should return a falsy value if each invert returns a falsy value', () => {
    const element = new Flip();
    element.invert.mockImplementation(() => false);

    const element2 = new Flip();
    element2.invert.mockImplementation(() => false);

    const group = new FlipGroup();
    group.addElement(element);
    group.addElement(element2);
    group.first();
    group.last();

    expect(group.invert()).toBe(false);
  });

  test('Invert method should return a truthy value if at least one element returns a truthy value', () => {
    const element = new Flip();
    element.invert.mockImplementation(() => false);

    const element2 = new Flip();
    element2.invert.mockImplementation(() => true);

    const group = new FlipGroup();
    group.addElement(element);
    group.addElement(element2);
    group.first();
    group.last();

    expect(group.invert()).toBe(true);
  });

  test('Play method should not return a promise if none of the elements are playable', () => {
    const element = new Flip();
    element.play.mockImplementation(() => {});

    const element2 = new Flip();
    element2.invert.mockImplementation(() => {});

    const group = new FlipGroup();
    group.addElement(element);
    group.addElement(element2);
    group.first();
    group.last();
    group.invert();
    expect(group.play()).not.toBeInstanceOf(Promise);
  });

  test('Play method should return a promise if at least one of the element returns a promise', () => {
    const element = new Flip();
    element.play.mockImplementation(
      () =>
        new Promise((resolve, reject) => {
          process.nextTick(() => resolve());
        })
    );

    const element2 = new Flip();
    element2.invert.mockImplementation(() => {});

    const group = new FlipGroup();
    group.addElement(element);
    group.addElement(element2);
    group.first();
    group.last();
    group.invert();
    expect(group.play()).toBeInstanceOf(Promise);
  });
});
