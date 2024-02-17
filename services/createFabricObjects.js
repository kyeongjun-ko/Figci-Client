import { fabric } from "fabric";
import createDiffText from "../utils/createDiffText";

const renderImg = async (el, number) => {
  const position = el.property.absoluteBoundingBox;

  if (el.type === "ELLIPSE") {
    const imageObject = async (addNumber, offSet) => {
      const { x, y, width, height } = offSet;

      return new Promise(resolve => {
        fabric.Image.fromURL(el.property.imageURL, img => {
          img.set({
            left: x + addNumber.dx,
            top: y + addNumber.dy,
          });

          const mask = new fabric.Ellipse({
            left: x + addNumber.dx,
            top: y + addNumber.dy,
            rx: width / 2,
            ry: height / 2,
            angle: el.property.arcData.endingAngle,
            absolutePositioned: true,
          });

          img.scaleToWidth(width);
          img.clipPath = mask;

          resolve(img);
        });
      });
    };

    const result = await imageObject(number, position);

    return result;
  }

  if (el.type === "RECTANGLE") {
    const imageObject = async (addNumber, offSet) => {
      const { x, y, width, height } = offSet;

      return new Promise((resolve, reject) => {
        const mask = new fabric.Rect({
          left: x + addNumber.dx,
          top: y + addNumber.dy,
          width,
          height,
          rx: el.property?.cornerRadius,
          ry: el.property?.cornerRadius,
          absolutePositioned: true,
        });

        fabric.Image.fromURL(el.property.imageURL, img => {
          try {
            img.set({
              left: x + addNumber.dx,
              top: y + addNumber.dy,
            });

            img.scaleToWidth(width);
            img.clipPath = mask;

            resolve(img);
          } catch {
            reject(new Error("이미지 로드에 실패했습니다."));
          }
        });
      });
    };

    const result = await imageObject(number, position);

    return result;
  }
};

const renderRect = async (el, number) => {
  const isExistImg = el.property.fills[0]?.imageRef ?? null;

  if (isExistImg) {
    const imageFabricObject = await renderImg(el, number);

    return imageFabricObject;
  }

  const style = el.property;
  const bgColor = style.fills[0]?.color ?? style.backgroundColor ?? null;
  const { strokes } = style;

  return new fabric.Rect({
    left: style.absoluteBoundingBox.x + number.dx,
    top: style.absoluteBoundingBox.y + number.dy,
    width: style.absoluteBoundingBox.width,
    height: style.absoluteBoundingBox.height,
    fill:
      bgColor &&
      `rgba(${bgColor.r * 255}, ${bgColor.g * 255}, ${bgColor.b * 255}, ${bgColor.a})`,
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

const renderFrame = async (el, number) => {
  const style = el.property;
  const bgColor = style.fills[0]?.color ?? style.backgroundColor ?? null;
  const { strokes } = style;

  const frameObject = new fabric.Rect({
    left: style.absoluteBoundingBox.x + number.dx,
    top: style.absoluteBoundingBox.y + number.dy,
    width: style.absoluteBoundingBox.width,
    height: style.absoluteBoundingBox.height,
    fill:
      bgColor &&
      `rgba(${bgColor.r * 255}, ${bgColor.g * 255}, ${bgColor.b * 255}, ${bgColor.a})`,
    opacity: style.fills[0]?.opacity ?? bgColor.a,
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

const renderEllipse = async (el, number) => {
  const isExistImg = el.property.fills[0]?.imageRef ?? null;

  if (isExistImg) {
    const imageFabricObject = await renderImg(el, number);

    return imageFabricObject;
  }
  const style = el.property;
  const bgColor = style.fills[0]?.color ?? style.backgroundColor ?? null;
  const { strokes } = style;

  return new fabric.Ellipse({
    left: style.absoluteBoundingBox.x + number.dx,
    top: style.absoluteBoundingBox.y + number.dy,
    rx: style.absoluteBoundingBox.width / 2,
    ry: style.absoluteBoundingBox.height / 2,
    fill:
      bgColor &&
      `rgba(${bgColor.r * 255}, ${bgColor.g * 255}, ${bgColor.b * 255}, ${bgColor.a})`,
    stroke: strokes.length
      ? `rgba(${strokes[0].color.r * 255}, ${strokes[0].color.g * 255}, ${strokes[0].color.b * 255}, ${strokes[0].color.a})`
      : 0,
    strokeAlign: style.strokeAlign && style.strokeAlign,
    angle: style.property?.arcData?.endingAngle,
    visible: true,
  });
};

const renderText = (el, number) => {
  const style = el.property;
  const bgColor = style.fills[0]?.color;
  const { strokes } = style;

  return new fabric.Textbox(style.characters, {
    left: style.absoluteBoundingBox.x + number.dx,
    top: style.absoluteBoundingBox.y + number.dy,
    width: style.absoluteBoundingBox.width,
    height: style.style.lineHeightPx,
    fontSize: style.style.fontSize,
    fontFamily: style.style.fontFamily,
    fontWeight: style.style.fontWeight,
    stroke: strokes.length
      ? `rgba(${strokes[0].color.r * 255}, ${strokes[0].color.g * 255}, ${strokes[0].color.b * 255}, ${strokes[0].color.a})`
      : 0,
    strokeWidth: style.strokeWeight && style.strokeWeight,
    strokeDashArray: style.strokeAlign && style.strokeDashes,
    strokeLineCap: style.strokeLineCap && style.strokeLineCap,
    strokeLineJoin: style.strokeJoin && style.strokeJoin,
    textAlign: style.style.textAlignHorizontal.toLowerCase(),
    verticalAlign: style.style.textAlignVertical.toLowerCase(),
    lineHeight: 1.2,
    fill:
      bgColor &&
      `rgba(${bgColor.r * 255}, ${bgColor.g * 255}, ${bgColor.b * 255}, ${bgColor.a})`,
  });
};

const renderTriangle = (el, number) => {
  const style = el.property;
  const point = el.property.absoluteBoundingBox;

  return new fabric.Triangle({
    left: point.x + number.dx,
    top: point.y + number.dy,
    width: point.width,
    height: style.rotation > 0 ? point.height : -point.height,
    fill: `rgba(${style.fills[0].color.r * 255}, ${style.fills[0].color.g * 255}, ${style.fills[0].color.b * 255}, ${style.fills[0].color.a})`,
    strokeWidth: style.strokeWeight,
  });
};

const renderDifference = (el, number) => {
  const { x, y, width, height } = el.position;

  const diffRect = new fabric.Rect({
    left: x + number.dx - 15,
    top: y + number.dy - 15,
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
    createDiffText(el.differenceInformation),
    {
      left: x + number.dx - 10 + width + 30,
      top: y + number.dy - 10,
      width: 400,
      fontFamily: "Noto Sans KR",
      fontWeight: 600,
      fontStyle: "normal",
      textAlign: "center",
      fontSize: 12,
      fill: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      opacity: 0.85,
      lineHeight: 1.2,
      hasBorders: true,
      borderColor: "rgba(0, 0, 0, 0.8)",
      visible: false,
    },
  );

  return [diffRect, diffContent];
};

const renderNewFrame = (el, number) => {
  const { x, y, width, height } = el.position;

  const diffRect = new fabric.Rect({
    left: x + number.dx - 10,
    top: y + number.dy - 10,
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
    createDiffText(el.differenceInformation),
    {
      left: x + number.dx - 10 + width + 30,
      top: y + number.dy - 10,
      width: 400,
      fontFamily: "Noto Sans KR",
      fontWeight: 600,
      fontStyle: "normal",
      textAlign: "center",
      fontSize: 12,
      fill: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      opacity: 0.85,
      lineHeight: 1.2,
      hasBorders: true,
      borderColor: "rgba(0, 0, 0, 0.8)",
      visible: false,
    },
  );

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
};

export default typeMapper;
