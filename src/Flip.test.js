import Flip from './Flip';

const createMock = () => {
  let current;
  return {
    mock: () => current,
    setNext: style => {
      current = style;
    }
  };
};

const makeFlip = ({ options = {}, firstStyle, lastStyle }) => {
  const {
    mock: getElementStyle,
    setNext: setNextElementStyle
  } = createMock();

  var flip = new Flip({
    element: document.createElement('div'),
    options: typeof options === 'function'
      ? () => ({
          ...options(),
          getElementStyle
        })
      : { ...options, getElementStyle }
  });

  setNextElementStyle(firstStyle);
  flip.first();

  setNextElementStyle(lastStyle);
  flip.last();
  flip.invert();

  return flip;
};

const getStateFromDiv = div => ({
  transform: div.style.transform &&
    div.style.transform.replace(/\n/g, '').replace(/ +/g, ' ').trim(),
  opacity: div.style.opacity
});

const getStateAndEnd = (div, end, flipPromise) =>
  new Promise((resolve, reject) => {
    setTimeout(
      () => {
        const state = getStateFromDiv(div);
        setTimeout(
          () => {
            end();
            resolve(flipPromise.then(() => state));
          },
          0
        );
      },
      0
    );
  });

const testAtSpecificTime = ({ firstStyle, lastStyle }) =>
  ({ options, atTime }) => {
    const { mock: now, setNext: setNow } = createMock();
    global.performance = {
      now: now
    };

    const flip = makeFlip({ options, firstStyle, lastStyle });

    setNow(0);
    const promise = flip.play();
    setNow(atTime);

    const endTime = flip.options.duration + flip.options.delay;
    if (atTime < endTime) {
      return getStateAndEnd(flip.element, () => setNow(endTime), promise);
    } else {
      return promise.then(() => getStateFromDiv(flip.element));
    }
  };

const defaultOptions = {
  firstStyle: {
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    opacity: 1
  },
  lastStyle: {
    top: 50,
    left: 60,
    width: 200,
    height: 300,
    opacity: 0.5
  }
};

const testDefaultStyleAt = testAtSpecificTime(defaultOptions);

describe('Flip', () => {
  beforeEach(() => {
    window.requestAnimationFrame = jest.fn();
    window.requestAnimationFrame.mockImplementation(callback => {
      setTimeout(callback, 0);
    });
  });

  test('Invert calculate how to transform a position to set it at his first position', () => {
    const flip = makeFlip(defaultOptions);

    expect(getStateFromDiv(flip.element)).toEqual({
      transform: 'translate(-60px, -50px) scale(0.5, 0.3333333333333333)',
      opacity: '1'
    });
  });

  test('Once the animation ended, the component should not have any transform left', () => {
    return testDefaultStyleAt({ atTime: 500 }).then(state => {
      expect(state).toEqual({
        transform: null,
        opacity: ''
      });
    });
  });

  test('At the middle of the animation, the element should come closer to his last position', () => {
    return testDefaultStyleAt({ atTime: 150 }).then(state => {
      expect(state).toEqual({
        transform: 'translate(-30px, -25px) scale(0.75, 0.6666666666666667)',
        opacity: '0.75'
      });
    });
  });

  test('The animation should respect the timing function', () => {
    return testDefaultStyleAt({
      atTime: 150,
      options: { timing: t => t * t }
    }).then(state => {
      expect(state).toEqual({
        transform: 'translate(-45px, -37.5px) scale(0.625, 0.5)',
        opacity: '0.875'
      });
    });
  });

  test('The element should not move until the delay has ended', () => {
    return testDefaultStyleAt({
      atTime: 200,
      options: { delay: 200 }
    }).then(state => {
      expect(state).toEqual({
        transform: 'translate(-60px, -50px) scale(0.5, 0.3333333333333333)',
        opacity: '1'
      });
    });
  });

  test('The element should start moving when the delay has ended', () => {
    return testDefaultStyleAt({
      atTime: 201,
      options: { delay: 200 }
    }).then(state => {
      expect(state).not.toEqual({
        transform: 'translate(-60px, -50px) scale(0.5, 0.3333333333333333)',
        opacity: '1'
      });
    });
  });

  test('The element should keep moving until the', () => {
    return testDefaultStyleAt({
      atTime: 499,
      options: { duration: 300, delay: 200 }
    }).then(state => {
      expect(state).not.toEqual({
        transform: null,
        opacity: ''
      });
    });
  });

  test('The options can be set by using a callback function', () => {
    return testDefaultStyleAt({
      atTime: 499,
      options: () => ({ duration: 300, delay: 200 })
    }).then(state => {
      expect(state).not.toEqual({
        transform: null,
        opacity: ''
      });
    });
  });

  test('The option updateScale should stop from updating scale during the animation', () => {
    return testDefaultStyleAt({
      atTime: 150,
      options: {
        updateScale: false
      }
    }).then(state => {
      expect(state).toEqual({
        transform: 'translate(-30px, -25px) scale(1, 1)',
        opacity: '0.75'
      });
    });
  });

  test('The option updateTranslate should stop from updating translation during the animation', () => {
    return testDefaultStyleAt({
      atTime: 150,
      options: {
        updateTranslate: false
      }
    }).then(state => {
      expect(state).toEqual({
        transform: 'translate(0px, 0px) scale(0.75, 0.6666666666666667)',
        opacity: '0.75'
      });
    });
  });

  test('The option updateOpacity should stop from updating opacity during the animation', () => {
    return testDefaultStyleAt({
      atTime: 150,
      options: {
        updateOpacity: false
      }
    }).then(state => {
      expect(state).toEqual({
        transform: 'translate(-30px, -25px) scale(0.75, 0.6666666666666667)',
        opacity: '0.5'
      });
    });
  });

  test('Style should not be updated when there is no difference between first and last', () => {
    const flip = makeFlip({
      firstStyle: defaultOptions.firstStyle,
      lastStyle: defaultOptions.firstStyle
    });
    expect(getStateFromDiv(flip.element)).toEqual({
      transform: null,
      opacity: ''
    });
  });

  test('Invert should not update style if first was not called', () => {
    const {
      mock: getElementStyle,
      setNext: setNextElementStyle
    } = createMock();

    var flip = new Flip({
      element: document.createElement('div'),
      options: {
        getElementStyle
      }
    });
    flip.last();
    flip.invert();

    expect(getStateFromDiv(flip.element)).toEqual({
      transform: undefined,
      opacity: ''
    });
  });

  test('Invert should not update style if last was not called', () => {
    const {
      mock: getElementStyle,
      setNext: setNextElementStyle
    } = createMock();

    var flip = new Flip({
      element: document.createElement('div'),
      options: {
        getElementStyle
      }
    });
    flip.first();
    flip.invert();

    expect(getStateFromDiv(flip.element)).toEqual({
      transform: undefined,
      opacity: ''
    });
  });

  test('Play should not update style if invert was not called', () => {
    const {
      mock: getElementStyle,
      setNext: setNextElementStyle
    } = createMock();

    var flip = new Flip({
      element: document.createElement('div'),
      options: {
        getElementStyle
      }
    });
    flip.first();
    flip.last();
    flip.play();

    expect(getStateFromDiv(flip.element)).toEqual({
      transform: undefined,
      opacity: ''
    });
  });
});
