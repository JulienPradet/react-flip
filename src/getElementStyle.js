const getElementStyle = element => {
  const style = window.getComputedStyle(element);
  const bounding = element.getBoundingClientRect();
  const opacity = parseFloat(style.opacity);
  return {
    top: bounding.top,
    left: bounding.left,
    width: bounding.width,
    height: bounding.height,
    opacity: Number.isNaN(opacity) ? 1 : opacity,
    zIndex: parseInt(style.zIndex, 10) || 0
  };
};

export default getElementStyle;
