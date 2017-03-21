const getElementStyle = element => {
  const style = window.getComputedStyle(element);
  const bounding = element.getBoundingClientRect();
  return {
    top: bounding.top,
    left: bounding.left,
    width: bounding.width,
    height: bounding.height,
    opacity: parseFloat(style.opacity) || 1,
    zIndex: parseInt(style.zIndex, 10) || 0
  };
};

export default getElementStyle;
