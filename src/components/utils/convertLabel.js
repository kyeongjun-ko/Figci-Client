function convertLabel(labelString) {
  const pattern = /\b\d{2}:\d{2}:\d{2}Z\b/;
  const match = labelString.match(pattern);

  if (match) {
    return labelString.slice(0, -4);
  }
  return labelString;
}

export default convertLabel;
