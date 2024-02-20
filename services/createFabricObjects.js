import { fabric } from "fabric";
import createDiffText from "../utils/createDiffText";
import FABRIC_RENDER from "../constants/renderConstants";

fabric.Textbox.prototype.set({
  _getNonTransformedDimensions() {
    return new fabric.Point(this.width, this.height).scalarAdd(this.padding);
  },
  _calculateCurrentDimensions() {
    return fabric.util.transformPoint(
      this._getTransformedDimensions(),
      this.getViewportTransform(),
      true,
    );
  },
});

const convertColorString = colorObject => {
  const { r, g, b, a } = colorObject;

  return `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a})`;
};
const renderImage = async (nodeJSON, offsetCoordinates) => {
  const position = nodeJSON.property.absoluteBoundingBox;

  if (nodeJSON.type === "ELLIPSE") {
    const imageObject = async (offsetCoordinates, positions) => {
      const { x, y, width, height } = positions;

      return new Promise(resolve => {
        const mask = new fabric.Ellipse({
          left: x + offsetCoordinates.dx,
          top: y + offsetCoordinates.dy,
          angle: nodeJSON.property.arcData.endingAngle,
          rx: width / 2,
          ry: height / 2,
          absolutePositioned: true,
        });

        fabric.Image.fromURL(nodeJSON.property.imageURL, img => {
          img.set({
            left: x + offsetCoordinates.dx,
            top: y + offsetCoordinates.dy,
          });

          img.scaleToWidth(width);
          img.clipPath = mask;

          resolve(img);
        });
      });
    };

    const fabricImageObject = await imageObject(offsetCoordinates, position);

    return fabricImageObject;
  }

  if (nodeJSON.type === "RECTANGLE") {
    const imageObject = async (offsetCoordinates, positions) => {
      const { x, y, width, height } = positions;

      return new Promise(resolve => {
        const mask = new fabric.Rect({
          left: x + offsetCoordinates.dx,
          top: y + offsetCoordinates.dy,
          width,
          height,
          rx: nodeJSON.property?.cornerRadius,
          ry: nodeJSON.property?.cornerRadius,
          absolutePositioned: true,
        });

        fabric.Image.fromURL(nodeJSON.property.imageURL, img => {
          img.set({
            left: x + offsetCoordinates.dx,
            top: y + offsetCoordinates.dy,
          });

          img.scaleToWidth(width);
          img.clipPath = mask;

          resolve(img);
        });
      });
    };

    const fabricImageObject = await imageObject(offsetCoordinates, position);

    return fabricImageObject;
  }
};

const renderRect = async (node, offsetCoordinates) => {
  const isExistImage = node.property.fills[0]?.imageRef ?? null;

  if (isExistImage) {
    const imageFabricObject = await renderImage(node, offsetCoordinates);

    return imageFabricObject;
  }

  const style = node.property;
  const backgroundColor =
    style.fills[0]?.color ?? style.backgroundColor ?? null;
  const { strokes } = style;

  return new fabric.Rect({
    left: style.absoluteBoundingBox.x + offsetCoordinates.dx,
    top: style.absoluteBoundingBox.y + offsetCoordinates.dy,
    width: style.absoluteBoundingBox.width,
    height: style.absoluteBoundingBox.height,
    fill: backgroundColor && convertColorString(backgroundColor),
    opacity: style.fills[0]?.opacity,
    stroke: strokes.length ? convertColorString(strokes[0].color) : 0,
    strokeAlign: style.strokeAlign && style.strokeAlign,
    rx: style.cornerRadius || 0,
    ry: style.cornerRadius || 0,
    visible: true,
    evented: true,
  });
};

const renderFrame = async (node, offsetCoordinates) => {
  const style = node.property;
  const backgroundColor =
    style.fills[0]?.color ?? style.backgroundColor ?? null;
  const { strokes } = style;

  const frameObject = new fabric.Rect({
    left: style.absoluteBoundingBox.x + offsetCoordinates.dx,
    top: style.absoluteBoundingBox.y + offsetCoordinates.dy,
    width: style.absoluteBoundingBox.width,
    height: style.absoluteBoundingBox.height,
    fill: backgroundColor && convertColorString(backgroundColor),
    opacity: style.fills[0]?.opacity ?? backgroundColor.a,
    stroke: strokes.length ? convertColorString(strokes[0].color) : 0,
    strokeAlign: style.strokeAlign,
    rx: style.cornerRadius || 0,
    ry: style.cornerRadius || 0,
    visible: true,
    evented: true,
  });

  return frameObject;
};

const renderEllipse = async (node, offsetCoordinates) => {
  const isExistImage = node.property.fills[0]?.imageRef ?? null;

  if (isExistImage) {
    const imageFabricObject = await renderImage(node, offsetCoordinates);

    return imageFabricObject;
  }
  const style = node.property;
  const backgroundColor =
    style.fills[0]?.color ?? style.backgroundColor ?? null;
  const { strokes } = style;

  return new fabric.Ellipse({
    left: style.absoluteBoundingBox.x + offsetCoordinates.dx,
    top: style.absoluteBoundingBox.y + offsetCoordinates.dy,
    rx: style.absoluteBoundingBox.width / 2,
    ry: style.absoluteBoundingBox.height / 2,
    fill: backgroundColor && convertColorString(backgroundColor),
    stroke: strokes.length ? convertColorString(strokes[0].color) : 0,
    strokeAlign: style.strokeAlign && style.strokeAlign,
    angle: style.property?.arcData?.endingAngle,
    visible: true,
  });
};

const renderText = (node, offsetCoordinates) => {
  const style = node.property;
  const backgroundColor = style.fills[0]?.color;
  const { strokes } = style;

  return new fabric.Textbox(style.characters, {
    left: style.absoluteBoundingBox.x + offsetCoordinates.dx,
    top: style.absoluteBoundingBox.y + offsetCoordinates.dy,
    width: style.absoluteBoundingBox.width,
    height: style.style.lineHeightPx,
    fontSize: style.style.fontSize,
    fontFamily: style.style.fontFamily,
    fontWeight: style.style.fontWeight,
    textAlign: style.style.textAlignHorizontal.toLowerCase(),
    lineHeight: FABRIC_RENDER.TEXT_LINE_HEIGHT,
    fill: backgroundColor && convertColorString(backgroundColor),
    stroke: strokes.length ? convertColorString(strokes[0].color) : 0,
    strokeWidth: style.strokeWeight && style.strokeWeight,
    strokeDashArray: style.strokeAlign && style.strokeDashes,
    strokeLineCap: style.strokeLineCap && style.strokeLineCap,
    strokeLineJoin: style.strokeJoin && style.strokeJoin,
    verticalAlign: style.style.textAlignVertical.toLowerCase(),
  });
};

const renderTriangle = (node, offsetCoordinates) => {
  const style = node.property;
  const position = node.property.absoluteBoundingBox;

  return new fabric.Triangle({
    left: position.x + offsetCoordinates.dx,
    top: position.y + offsetCoordinates.dy,
    width: position.width,
    height: style.rotation > 0 ? position.height : -position.height,
    fill: convertColorString(style.fills[0].color),
    strokeWidth: style.strokeWeight,
  });
};

const renderDifference = (node, offsetCoordinates) => {
  const { x, y, width, height } = node.position;

  const diffRect = new fabric.Rect({
    left: x + offsetCoordinates.dx - 15,
    top: y + offsetCoordinates.dy - 15,
    width: width + 20,
    height: height + 20,
    fill: FABRIC_RENDER.CHANGE_RECT_COLOR,
    stroke: FABRIC_RENDER.CHANGE_RECT_STROKE,
    strokeWidth: 2,
    strokeOpacity: 1,
    rx: 5,
    ry: 5,
    evented: true,
  });

  const diffContent = new fabric.Textbox(
    createDiffText(node.differenceInformation),
    {
      left: x + offsetCoordinates.dx - 10 + width + 30,
      top: y + offsetCoordinates.dy - 10,
      width: FABRIC_RENDER.TEXTBOX_WIDTH,
      fontFamily: FABRIC_RENDER.TEXT_FAMILY,
      fontWeight: FABRIC_RENDER.TEXT_WEIGHT,
      fontSize: FABRIC_RENDER.TEXT_SIZE,
      lineHeight: FABRIC_RENDER.TEXT_LINE_HEIGHT,
      padding: FABRIC_RENDER.TEXT_PADDING,
      textBackgroundColor: FABRIC_RENDER.TEXT_BACKGROUND_COLOR,
      opacity: 0.8,
      fill: FABRIC_RENDER.TEXT_COLOR,
      hasBorders: true,
      borderColor: "rgba(0, 0, 0, 1)",
      visible: false,
    },
  );

  return [diffRect, diffContent];
};

const renderNewFrame = (node, offsetCoordinates) => {
  const { x, y, width, height } = node.position;

  const diffRect = new fabric.Rect({
    left: x + offsetCoordinates.dx - 10,
    top: y + offsetCoordinates.dy - 10,
    width: width + 20,
    height: height + 20,
    fill: FABRIC_RENDER.NEW_RECT_COLOR,
    stroke: FABRIC_RENDER.NEW_RECT_STROKE,
    strokeWidth: 2,
    strokeOpacity: 1,
    rx: 5,
    ry: 5,
  });

  const diffContent = new fabric.Textbox(
    createDiffText(node.differenceInformation),
    {
      left: x + offsetCoordinates.dx - 10 + width + 30,
      top: y + offsetCoordinates.dy - 10,
      width: FABRIC_RENDER.TEXTBOX_WIDTH,
      fontFamily: FABRIC_RENDER.TEXT_FAMILY,
      fontWeight: FABRIC_RENDER.TEXT_WEIGHT,
      fontSize: FABRIC_RENDER.TEXT_SIZE,
      lineHeight: FABRIC_RENDER.TEXT_LINE_HEIGHT,
      padding: FABRIC_RENDER.TEXT_PADDING,
      textBackgroundColor: FABRIC_RENDER.TEXT_BACKGROUND_COLOR,
      opacity: 0.85,
      fill: FABRIC_RENDER.TEXT_COLOR,
      rx: 10,
      ry: 10,
      borderColor: "rgba(0, 0, 0, 1)",
      isWrapping: true,
      hasBorders: true,
      visible: false,
    },
  );

  return [diffRect, diffContent];
};

const renderNewFrameInfo = (node, offsetCoordinates) => {
  const { x, y, width, height } = node.property.absoluteBoundingBox;

  const diffRect = new fabric.Rect({
    left: x + offsetCoordinates.dx - 10,
    top: y + offsetCoordinates.dy - 10,
    width: width + 20,
    height: height + 20,
    fill: FABRIC_RENDER.NEW_RECT_COLOR,
    stroke: FABRIC_RENDER.NEW_RECT_STROKE,
    strokeWidth: 2,
    strokeOpacity: 1,
    rx: 5,
    ry: 5,
  });

  const diffContent = new fabric.Textbox("새로 생성된 프레임 입니다.", {
    left: x + offsetCoordinates.dx - 10 + width + 30,
    top: y + offsetCoordinates.dy - 10,
    width: FABRIC_RENDER.TEXTBOX_WIDTH,
    fontFamily: FABRIC_RENDER.TEXT_FAMILY,
    fontWeight: FABRIC_RENDER.TEXT_WEIGHT,
    textAlign: FABRIC_RENDER.TEXT_ALIGN,
    fontSize: FABRIC_RENDER.TEXT_SIZE,
    lineHeight: FABRIC_RENDER.TEXT_LINE_HEIGHT,
    padding: FABRIC_RENDER.TEXT_PADDING,
    textBackgroundColor: FABRIC_RENDER.TEXT_BACKGROUND_COLOR,
    opacity: FABRIC_RENDER.TEXTBOX_OPACITY,
    fill: FABRIC_RENDER.TEXT_COLOR,
    borderColor: "rgba(0, 0, 0, 1)",
    rx: 10,
    ry: 10,
    isWrapping: false,
    hasBorders: true,
    visible: false,
  });

  return [diffRect, diffContent];
};

const typeMapper = {
  GROUP: renderRect,
  RECTANGLE: renderRect,
  TEXT: renderText,
  INSTANCE: renderRect,
  FRAME: renderFrame,
  REGULAR_POLYGON: renderTriangle,
  VECTOR: renderRect,
  COMPONENT: renderRect,
  ELLIPSE: renderEllipse,
  MODIFIED: renderDifference,
  NEW: renderNewFrame,
  BOOLEAN_OPERATION: renderRect,
  NEW_FRAME: renderNewFrameInfo,
};

export default typeMapper;
