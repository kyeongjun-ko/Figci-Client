import { fabric } from "fabric";
import createDiffText from "../utils/createDiffText";

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

const renderImg = async (nodeJSON, offsetCoord) => {
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

    const fabricImageObject = await imageObject(offsetCoord, position);

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

    const fabricImageObject = await imageObject(offsetCoord, offsetCoord);

    return fabricImageObject;
  }
};

const renderRect = async (node, offsetCoordinates) => {
  const isExistImg = node.property.fills[0]?.imageRef ?? null;

  if (isExistImg) {
    const imageFabricObject = await renderImg(node, offsetCoordinates);

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
    fill:
      backgroundColor &&
      `rgba(${backgroundColor.r * 255}, ${backgroundColor.g * 255}, ${backgroundColor.b * 255}, ${backgroundColor.a})`,
    opacity: style.fills[0]?.opacity,
    stroke: strokes.length
      ? `rgba(${strokes[0].color.r * 255}, ${strokes[0].color.g * 255}, ${strokes[0].color.b * 255}, ${strokes[0].color.a})`
      : 0,
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
    fill:
      backgroundColor &&
      `rgba(${backgroundColor.r * 255}, ${backgroundColor.g * 255}, ${backgroundColor.b * 255}, ${backgroundColor.a})`,
    opacity: style.fills[0]?.opacity ?? backgroundColor.a,
    stroke: strokes.length
      ? `rgba(${strokes[0].color.r * 255}, ${strokes[0].color.g * 255}, ${strokes[0].color.b * 255}, ${strokes[0].color.a})`
      : 0,
    strokeAlign: style.strokeAlign,
    rx: style.cornerRadius || 0,
    ry: style.cornerRadius || 0,
    visible: true,
    evented: true,
  });

  return frameObject;
};

const renderEllipse = async (node, offsetCoordinates) => {
  const isExistImg = node.property.fills[0]?.imageRef ?? null;

  if (isExistImg) {
    const imageFabricObject = await renderImg(node, offsetCoordinates);

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
    fill:
      backgroundColor &&
      `rgba(${backgroundColor.r * 255}, ${backgroundColor.g * 255}, ${backgroundColor.b * 255}, ${backgroundColor.a})`,
    stroke: strokes.length
      ? `rgba(${strokes[0].color.r * 255}, ${strokes[0].color.g * 255}, ${strokes[0].color.b * 255}, ${strokes[0].color.a})`
      : 0,
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
    lineHeight: 1.2,
    fill:
      backgroundColor &&
      `rgba(${backgroundColor.r * 255}, ${backgroundColor.g * 255}, ${backgroundColor.b * 255}, ${backgroundColor.a})`,
    stroke: strokes.length
      ? `rgba(${strokes[0].color.r * 255}, ${strokes[0].color.g * 255}, ${strokes[0].color.b * 255}, ${strokes[0].color.a})`
      : 0,
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
    fill: `rgba(${style.fills[0].color.r * 255}, ${style.fills[0].color.g * 255}, ${style.fills[0].color.b * 255}, ${style.fills[0].color.a})`,
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
    fill: "rgba(180, 46, 46, 0)",
    stroke: "rgba(243, 7, 7, 0.7)",
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
      width: 400,
      fontFamily: "Noto Sans KR",
      fontWeight: 600,
      fontStyle: "normal",
      textAlign: "left",
      fontSize: 20,
      lineHeight: 1.2,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      opacity: 0.8,
      fill: "rgba(255, 255, 255, 1)",
      hasBorders: true,
      borderColor: "rgba(0, 0, 0, 0.8)",
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
    fill: "rgba(3, 148, 16, 0)",
    stroke: "rgba(3, 148, 16, 0.7)",
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
      width: 400,
      fontFamily: "Noto Sans KR",
      fontWeight: 600,
      fontStyle: "normal",
      textAlign: "left",
      fontSize: 12,
      lineHeight: 1.2,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      opacity: 0.85,
      fill: "rgba(255, 255, 255, 1)",
      rx: 10,
      ry: 10,
      hasBorders: true,
      borderColor: "rgba(0, 0, 0, 0.8)",
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
    fill: "rgba(3, 148, 16, 0)",
    stroke: "rgba(3, 148, 16, 0.7)",
    strokeWidth: 2,
    strokeOpacity: 1,
    rx: 5,
    ry: 5,
  });

  const diffContent = new fabric.Textbox("새로 생성된 프레임 입니다.", {
    left: x + offsetCoordinates.dx - 10 + width + 30,
    top: y + offsetCoordinates.dy - 10,
    width: 200,
    padding: 20,
    fontFamily: "Noto Sans KR",
    fontWeight: 500,
    fontStyle: "normal",
    textAlign: "left",
    fontSize: 16,
    lineHeight: 1.2,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    opacity: 0.85,
    fill: "rgba(255, 255, 255, 1)",
    borderColor: "rgba(0, 0, 0, 0.8)",
    rx: 10,
    ry: 10,
    isWrapping: true,
    splitByGrapheme: true,
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
