import { fabric } from "fabric";

const renderRect = (el, number) => {
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
    stroke: strokes.length
      ? `rgba(${strokes[0].color.r * 255}, ${strokes[0].color.g * 255}, ${strokes[0].color.b * 255}, ${strokes[0].color.a})`
      : 0,
    strokeAlign: style.strokeAlign && style.strokeAlign,
    rx: style.cornerRadius || 0,
    ry: style.cornerRadius || 0,
    visible: true,
  });
};
