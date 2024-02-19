import typeMapper from "./createFabricObjects";

const matchType = async (el, number) => {
  if (!el.type) {
    const getDefaultFunction = typeMapper.RECTANGLE;
    const fabricObject = await getDefaultFunction(el, number);

    return fabricObject;
  }

  const getTypeFunction = typeMapper[el.type];

  if (getTypeFunction) {
    const fabricObject = await getTypeFunction(el, number);

    return fabricObject;
  }
};

const renderFabricDifference = async function (differences, fixCoord, frameId) {
  const differenceArray = [];

  if (differences.isNew) {
    differences.type = "NEW_FRAME";
    const fabricObjects = await matchType(differences, fixCoord);
    const [rectObject, textObject] = fabricObjects;

    rectObject.on("mouseover", () => {
      rectObject.set({
        fill: "rgba(53, 180, 46, 0.7)",
      });
      textObject.set({
        visible: true,
      });
      this.renderAll();
    });

    rectObject.on("mouseout", () => {
      rectObject.set({
        fill: "rgba(255, 255, 255, 0)",
      });
      textObject.set({
        visible: false,
      });
      this.renderAll();
    });

    differenceArray.push(rectObject, textObject);
  } else {
    for (const nodeId in differences) {
      if (differences[nodeId].frameId === frameId) {
        const fabricObjects = await matchType(differences[nodeId], fixCoord);
        const [rectObject, textObject] = fabricObjects;

        rectObject.on("mouseover", () => {
          rectObject.set({
            fill: "rgba(180, 46, 46, 0.7)",
          });
          textObject.set({
            visible: true,
          });
          this.renderAll();
        });

        rectObject.on("mouseout", () => {
          rectObject.set({
            fill: "rgba(255, 255, 255, 0)",
          });
          textObject.set({
            visible: false,
          });
          this.renderAll();
        });

        differenceArray.push(rectObject, textObject);
      }
    }
  }

  this.add(...differenceArray);
  this.renderAll();
};

export default renderFabricDifference;
