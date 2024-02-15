const createDiffText = diffTextObject => {
  let differenceTexts = "";

  for (const propertyKey in diffTextObject) {
    const propertyValue = diffTextObject[propertyKey];

    const [propTitle, ...propDetail] = propertyKey.split(".");
    const [beforeValue, afterValue] = propertyValue.split("=>");

    if (beforeValue === undefined) {
      differenceTexts += propDetail
        ? `${propTitle} ${propDetail} 속성 ${afterValue} 추가.\n`
        : `${propTitle} 속성 ${afterValue} 추가.\n`;
    } else {
      differenceTexts += propDetail
        ? `${propTitle} 속성 ${beforeValue} => ${afterValue}.\n`
        : `${propTitle} ${propDetail} 속성 ${beforeValue} => ${afterValue}\n`;
    }
  }
  return differenceTexts;
};

export default createDiffText;
