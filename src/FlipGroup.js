import Flip from './Flip';

class FlipGroup {
  constructor() {
    this.elements = [];
  }

  addElement(element) {
    if (element instanceof Flip) {
      this.elements = [...this.elements, element];

      return () => {
        this.elements = this.elements.filter(current => current !== element);
      };
    }
  }

  first() {
    this.elements.forEach(element => element.first());
  }

  last() {
    this.elements.forEach(element => element.last());
  }

  invert() {
    return this.elements
      .map(element => element.invert())
      .some(hasInverted => hasInverted);
  }

  play() {
    const playPromises = this.elements
      .map(element => element.play())
      .filter(promise => promise);

    if (playPromises.length === 0) {
      return;
    }
    return Promise.all(playPromises);
  }
}

export default FlipGroup;
