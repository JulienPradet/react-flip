import getElementStyle from './getElementStyle';

describe('getElementStyle', () => {
  test('should get current style', () => {
    const element = document.createElement('div');
    window.getComputedStyle = jest.fn();
    window.getComputedStyle.mockImplementation(() => ({
      zIndex: '1',
      opacity: '0.5'
    }));

    element.getBoundingClientRect = jest.fn();
    element.getBoundingClientRect.mockImplementation(() => ({
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }));

    expect(getElementStyle(element)).toEqual({
      zIndex: 1,
      opacity: 0.5,
      top: 0,
      left: 0,
      width: 0,
      height: 0
    });
  });

  test('should set a default zIndex at 0', () => {
    const element = document.createElement('div');
    window.getComputedStyle = jest.fn();
    window.getComputedStyle.mockImplementation(() => ({
      zIndex: ''
    }));

    element.getBoundingClientRect = jest.fn();
    element.getBoundingClientRect.mockImplementation(() => ({}));

    expect(getElementStyle(element).zIndex).toEqual(0);
  });

  test('should set a default opacity at 1', () => {
    const element = document.createElement('div');
    window.getComputedStyle = jest.fn();
    window.getComputedStyle.mockImplementation(() => ({
      opacity: ''
    }));

    element.getBoundingClientRect = jest.fn();
    element.getBoundingClientRect.mockImplementation(() => ({}));

    expect(getElementStyle(element).opacity).toEqual(1);
  });
});
