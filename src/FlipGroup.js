import Flip from './Flip';

const getElementKey = defer => defer ? 'elementsDeferred' : 'elements';

const getConcernedElements = (defer, elements, deferredElements) => {
  if (defer === undefined) {
    return elements.concat(deferredElements);
  } else if (defer) {
    return deferredElements.concat(deferredElements);
  } else {
    return elements;
  }
};

class FlipGroup {
  constructor() {
    this.elements = [];
    this.elementsDeferred = [];
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
    getConcernedElements(
      deferred,
      this.elements,
      this.elementsDeferred
    ).forEach(element => element.first());
  }

  last({ deferred } = {}) {
    getConcernedElements(
      deferred,
      this.elements,
      this.elementsDeferred
    ).forEach(element => element.last());
  }

  invert({ deferred } = {}) {
    return getConcernedElements(deferred, this.elements, this.elementsDeferred)
      .map(element => element.invert())
      .some(hasInverted => hasInverted);
  }

  play() {
    const playPromises = this.elements
      .concat(this.elementsDeferred)
      .map(element => element.play())
      .filter(promise => promise);

    if (playPromises.length === 0) {
      return;
    }
    return Promise.all(playPromises);
  }
}

export default FlipGroup;
