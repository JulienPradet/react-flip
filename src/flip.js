const getElementStyle = element => {
  const style = window.getComputedStyle(element);
  return {
    ...element.getBoundingClientRect(),
    opacity: parseFloat(style.opacity) || 1,
    zIndex: parseInt(style.zIndex, 10) || 0
  };
};

const defaultOptions = {
  duration: 300,
  updateTranslate: true,
  updateScale: true,
  updateOpacity: true,
  delay: 0,
  durationMultiplier: 1,
  getElementStyle: getElementStyle,
  timing: time =>
    Math.pow(time, 2) / (Math.pow(time, 2) + Math.pow(1 - time, 2))
};

class Flip {
  constructor({ element, options }) {
    this.element = element;
    this.options = Object.assign({}, defaultOptions, options);

    this.animate = this.animate.bind(this);
  }

  first() {
    this._first = this.options.getElementStyle(this.element);
  }

  last() {
    this._last = this.options.getElementStyle(this.element);
  }

  invert() {
    if (!this._first || !this._last) return;
    this._invert = {
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 0
    };

    if (this.options.updateTranslate) {
      this._invert.translateX = this._first.left - this._last.left;
      this._invert.translateY = this._first.top - this._last.top;
    }
    if (this.options.updateScale) {
      this._invert.scaleX = this._first.width / this._last.width;
      this._invert.scaleY = this._first.height / this._last.height;
    }
    if (this.options.updateOpacity) {
      this._invert.opacity = this._first.opacity - this._last.opacity;
    }

    if (
      this._invert.translateX === 0 &&
      this._invert.translateY === 0 &&
      this._invert.scaleX === 1 &&
      this._invert.scaleY === 1 &&
      this._invert.opacity === 0
    ) {
      this.resetStyle();
      return;
    }

    this.updateStyle(0);
    this.element.style.zIndex = Math.max(this._first.zIndex, this._last.zIndex);
    this.element.style.transformOrigin = '0 0';
    this.element.style.willChange = 'transform, opacity';
    return Promise.resolve(true);
  }

  play(startTime) {
    if (!this._invert) return;

    this._start = window.performance.now() +
      this.options.delay * this.options.durationMultiplier;

    const promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(this.animate);
    } else {
      setTimeout(this.animate, 0);
    }

    return promise;
  }

  animate() {
    let time = (window.performance.now() - this._start) /
      (this.options.duration * this.options.durationMultiplier);
    if (time > 1) time = 1;
    if (time < 0) time = 0;

    this.updateStyle(this.options.timing(time));

    if (time < 1) {
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(this.animate);
      } else {
        setTimeout(this.animate, 0);
      }
    } else {
      this.resetStyle();
    }
  }

  updateStyle(time) {
    const transform = {
      translateX: this._invert.translateX * (1 - time),
      translateY: this._invert.translateY * (1 - time),
      scaleX: this._invert.scaleX + (1 - this._invert.scaleX) * time,
      scaleY: this._invert.scaleY + (1 - this._invert.scaleY) * time,
      opacity: this._last.opacity + this._invert.opacity * (1 - time)
    };
    this.element.style.transform = `
      translate(${transform.translateX}px, ${transform.translateY}px)
      scale(${transform.scaleX}, ${transform.scaleY})
    `;
    this.element.style.opacity = transform.opacity;
  }

  resetStyle() {
    this._invert = null;
    this.element.style.transformOrigin = null;
    this.element.style.transform = null;
    this.element.style.opacity = null;
    this.element.style.willChange = null;
    this.element.style.zIndex = null;
    this.resolve && this.resolve();
  }
}

export default Flip;
