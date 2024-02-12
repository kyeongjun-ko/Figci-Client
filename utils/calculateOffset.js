const calculateOffset = frame => {
  const [xList, yList] = [[], []];

  for (const key in frame) {
    xList.push(frame[key].property.absoluteBoundingBox.x);
    yList.push(frame[key].property.absoluteBoundingBox.y);
  }

  const minX = Math.min(...xList);
  const minY = Math.min(...yList);

  return {
    dx: minX < 0 ? Math.abs(minX) + 20 : 0,
    dy: minY < 0 ? Math.abs(minY) + 20 : 0,
  };
};

export default calculateOffset;
