import { fabric } from "fabric";
import fixCoordinate from "../utils/fixCoordinate";
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

  const frameRootObject = await matchType(frameJSON, fixCoordinate(frameJSON));

  frameRootObject.stroke = "black";
  frameRootObject.strokeWidth = 2;

  fabricObject.set(frameJSON.frameId, frameRootObject);

  for (const nodeId in frameJSON.nodes) {
    if (frameJSON.nodes[nodeId].property.fills[0]?.imageRef) {
      const { imageRef } = frameJSON.nodes[nodeId].property.fills[0];

      if (imageUrl[imageRef]) {
        frameJSON.nodes[nodeId].property.imageURL = imageUrl[imageRef];
      }
    }

    fabricObject.set(
      nodeId,
      await matchType(frameJSON.nodes[nodeId], fixCoordinate(frameJSON)),
    );
  }

  for (const nodeId in frameJSON.nodes) {
    const targetNode = frameJSON.nodes[nodeId];
    const childrenIds = [];

    if (targetNode.property.clipsContent) {
      const clipTarget = fabricObject.get(nodeId);
      clipTarget.absolutePositioned = true;
      fabricObject.set(nodeId, clipTarget);

      targetNode.property.overrides?.forEach(node => {
        if (node.overriddenFields.includes("fills")) {
          childrenIds.push(node.id);
        }
      });
    }

    while (childrenIds.length) {
      const clipChildId = childrenIds.pop();
      const clipParent = fabricObject.get(nodeId);
      const clipChild = fabricObject.get(clipChildId);
      clipChild.clipPath = clipParent;
      fabricObject.set(clipChildId, clipChild);
    }
  }

  if (frameJSON.property.clipsContent === true) {
    const clippedNode = fabricObject.get(frameJSON.frameId);
    clippedNode.absolutePositioned = true;
    fabricObject.set(frameJSON.frameId, clippedNode);

    for (const nodeId in fabricObject) {
      const isChildNode = nodeId !== frameJSON.frameId;
      const isNotClipped = !fabricObject.get(nodeId)?.clipPath;

      if (isChildNode && isNotClipped) {
        const clipChild = fabricObject.get(nodeId);
        clipChild.clipPath = clippedNode;
        fabricObject.set(nodeId, clipChild);
      }
    }
  }

  const fabricObjectArray = [...fabricObject.values()];
  const objectGroup = new fabric.Group(fabricObjectArray);

  this.add(objectGroup);
};

export default renderFabricFrame;
