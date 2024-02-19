import { fabric } from "fabric";
import fixRenderCoord from "../utils/fixRenderCoord";
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

const renderFabricFrame = async function (frameJSON, imageUrl) {
  const fabricObject = new Map();

  if (frameJSON.type === "NEW_FRAME") {
    frameJSON.type = "";
  }

  const parent = await matchType(frameJSON, fixRenderCoord(frameJSON));

  parent.stroke = "black";
  parent.strokeWidth = 2;

  fabricObject.set(frameJSON.frameId, parent);

  for (const nodeId in frameJSON.nodes) {
    if (frameJSON.nodes[nodeId].property.fills[0]?.imageRef) {
      const { imageRef } = frameJSON.nodes[nodeId].property.fills[0];

      if (imageUrl[imageRef]) {
        frameJSON.nodes[nodeId].property.imageURL = imageUrl[imageRef];
      }
    }

    fabricObject.set(
      nodeId,
      await matchType(frameJSON.nodes[nodeId], fixRenderCoord(frameJSON)),
    );
  }

  for (const nodeId in frameJSON.nodes) {
    const targetNode = frameJSON.nodes[nodeId];
    const childrenIds = [];

    if (
      targetNode.property.clipsContent &&
      targetNode.property.clipsContent === true
    ) {
      fabricObject.get(nodeId).absolutePositioned = true;

      targetNode.property.overrides?.forEach(node => {
        if (node.overriddenFields.includes("fills")) {
          childrenIds.push(node.id);
        }
      });
    }

    while (childrenIds.length) {
      const clipTargetId = childrenIds.pop();

      fabricObject.get(clipTargetId).clipPath = fabricObject.get(nodeId);
    }
  }

  if (frameJSON.property.clipsContent === true) {
    fabricObject.get(frameJSON.frameId).absolutePositioned = true;

    for (const nodeId in fabricObject) {
      if (nodeId !== frameJSON.frameId && !fabricObject.get(nodeId)?.clipPath) {
        fabricObject.get(nodeId).clipPath = fabricObject.get(frameJSON.frameId);
      }
    }
  }

  const fabricObjectArray = [...fabricObject.values()];
  const objectGroup = new fabric.Group(fabricObjectArray);

  this.add(objectGroup);
};

export default renderFabricFrame;
