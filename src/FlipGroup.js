import Flip from './Flip';

const not = fn => x => !fn(x);
const isDeferred = element => element.defer;

class FlipGroup {
  constructor() {
    this.elements = [];
    this.elementsDeferred = [];
  }

  getConcernedElements(defer) {
    if (defer === undefined) {
      return this.elements;
    } else if (defer) {
      return this.elements.filter(isDeferred);
    } else {
      return this.elements.filter(not(isDeferred));
    }
  }

  addElement(element, defer) {
    if (element instanceof Flip) {
      this.elements = [...this.elements, { element, defer }];

      return () => {
        this.elements = this.elements.filter(
          current => current.element !== element
        );
      };
    }
  }

  first({ deferred } = {}) {
    this.getConcernedElements(deferred).forEach(({ element }) =>
      element.first());
  }

  last({ deferred } = {}) {
    this.getConcernedElements(deferred).forEach(({ element }) =>
      element.last());
  }

  invert({ deferred } = {}) {
    return this.getConcernedElements(deferred)
      .map(({ element }) => element.invert())
      .some(hasInverted => hasInverted);
  }

  play() {
    const playPromises = this.getConcernedElements()
      .map(({ element }) => element.play())
      .filter(promise => promise);

    if (playPromises.length === 0) {
      return;
    }
    return Promise.all(playPromises);
  }
}

export default FlipGroup;
