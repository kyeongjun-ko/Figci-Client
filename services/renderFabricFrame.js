import { fabric } from "fabric";
import fixCoordinate from "../utils/fixCoordinate";
import typeMapper from "./createFabricObjects";
import FABRIC_RENDER from "../constants/renderConstants";

const matchType = async (figmaNode, offsetCoordinates) => {
  if (!figmaNode.type) {
    const getDefaultFunction = typeMapper.RECTANGLE;
    const fabricObject = await getDefaultFunction(figmaNode, offsetCoordinates);

    return fabricObject;
  }

  const getTypeFunction = typeMapper[figmaNode.type];

  if (getTypeFunction) {
    const fabricObject = await getTypeFunction(figmaNode, offsetCoordinates);

    return fabricObject;
  }
};

const renderFabricFrame = async function (frameJSON, imageUrl) {
  const fabricObject = new Map();

  if (frameJSON.type === "NEW_FRAME") {
    frameJSON.type = "";
  }

  const frameRootObject = await matchType(frameJSON, fixCoordinate(frameJSON));

  frameRootObject.stroke = FABRIC_RENDER.STROKE_COLOR;
  frameRootObject.strokeWidth = FABRIC_RENDER.STROKE_WIDTH;

  fabricObject.set(frameJSON.frameId, frameRootObject);

  for (const nodeId in frameJSON.nodes) {
    if (frameJSON.nodes.hasOwnProperty.call(frameJSON.nodes, nodeId)) {
      const isIncludeImage =
        frameJSON.nodes[nodeId].property.fills[0]?.imageRef;

      if (isIncludeImage) {
        const { imageRef } = frameJSON.nodes[nodeId].property.fills[0];

        if (imageUrl[imageRef]) {
          frameJSON.nodes[nodeId].property.imageURL = imageUrl[imageRef];
        }
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
      const clipTargetNode = fabricObject.get(nodeId);

      clipTargetNode.absolutePositioned = true;
      fabricObject.set(nodeId, clipTargetNode);

      targetNode.property.overrides?.forEach(innerNode => {
        if (innerNode.overriddenFields.includes("fills")) {
          childrenIds.push(innerNode.id);
        }
      });
    }

    while (childrenIds.length) {
      const clippedTargetNodeId = childrenIds.pop();

      const clipTargetNode = fabricObject.get(nodeId);
      const fabricChildObject = fabricObject.get(clippedTargetNodeId);

      fabricChildObject.clipPath = clipTargetNode;
      fabricObject.set(clippedTargetNodeId, fabricChildObject);
    }
  }

  if (frameJSON.property.clipsContent === true) {
    const clipTargetNode = fabricObject.get(frameJSON.frameId);

    clipTargetNode.absolutePositioned = true;
    fabricObject.set(frameJSON.frameId, clipTargetNode);

    for (const fabricObjectId in fabricObject) {
      const isChildOfFrame = fabricObjectId !== frameJSON.frameId;
      const isNotClipped = !fabricObject.get(fabricObjectId)?.clipPath;

      if (isChildOfFrame && isNotClipped) {
        const clippedTargetNode = fabricObject.get(fabricObjectId);

        clippedTargetNode.clipPath = clipTargetNode;
        fabricObject.set(fabricObjectId, clippedTargetNode);
      }
    }
  }

  const fabricObjectArray = [...fabricObject.values()];
  const objectGroup = new fabric.Group(fabricObjectArray);

  this.add(objectGroup);
};

export default renderFabricFrame;
