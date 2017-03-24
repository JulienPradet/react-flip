import Flip from './Flip';

const getElementKey = defer => defer ? 'elementsDeferred' : 'elements';

class FlipGroup {
  constructor() {
    this.elements = [];
    this.elementsDeferred = [];
  }

  getConcernedElements(defer) {
    if (defer === undefined) {
      return this.elements.concat(this.elementsDeferred);
    } else if (defer) {
      return this.elementsDeferred;
    } else {
      return this.elements;
    }
  }

  addElement(element, defer) {
    if (element instanceof Flip) {
      const elementKey = getElementKey(defer);
      this[elementKey] = [...this[elementKey], element];

      return () => {
        this[elementKey] = this[elementKey].filter(
          current => current !== element
        );
      };
    }
  }

  first({ deferred } = {}) {
    this.getConcernedElements(deferred).forEach(element => element.first());
  }

  last({ deferred } = {}) {
    this.getConcernedElements(deferred).forEach(element => element.last());
  }

  invert({ deferred } = {}) {
    return this.getConcernedElements(deferred)
      .map(element => element.invert())
      .some(hasInverted => hasInverted);
  }

  play() {
    const playPromises = this.getConcernedElements()
      .map(element => element.play())
      .filter(promise => promise);

    if (playPromises.length === 0) {
      return;
    }
    return Promise.all(playPromises);
  }
}

export default FlipGroup;
