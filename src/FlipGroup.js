import Flip from './Flip';

const getElementKey = defer => defer ? 'elementsDeferred' : 'elements';

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

  first({ deferred } = { deferred: false }) {
    this[getElementKey(deferred)].forEach(element => element.first());
  }

  last() {
    this.elements.forEach(element => element.last());
    this.elementsDeferred.forEach(element => element.last());
  }

  invert() {
    return this.elements
      .concat(this.elementsDeferred)
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
