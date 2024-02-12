import { fabric } from "fabric";

const renderImg = async (el, number) => {
  const { nodeId } = el;
  const position = el.property.absoluteBoundingBox;

  const devProjectKey = "x7GJK9PUJZMKB0tB7RqEc3";

  const baseFigmaURL = `/v1/images/${devProjectKey}?ids=${nodeId}`;
  const token = JSON.parse(localStorage.getItem("FigmaToken")).access_token;

  const response = await fetch(baseFigmaURL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const { images } = await response.json();

  const imageURL = images[nodeId];

  const setImageXY = async (imgObject, numberToAdd, coordinate) => {
    const { x, y, width, height } = coordinate;

    return imgObject.set({
      left: x + numberToAdd.dx,
      top: y + numberToAdd.dy,
      width,
      height,
    });
  };

  const imageObject = () => {
    const ImageRectangle = fabric.Image.fromURL(imageURL);

    return setImageXY(ImageRectangle, number, position);
  };

  return imageObject();
};

const renderRect = (el, number) => {
  const isExistImg = el.property.fills[0]?.imageRef ?? null;

  if (isExistImg) {
    return renderImg(el, number);
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
    stroke: strokes.length
      ? `rgba(${strokes[0].color.r * 255}, ${strokes[0].color.g * 255}, ${strokes[0].color.b * 255}, ${strokes[0].color.a})`
      : 0,
    strokeAlign: style.strokeAlign && style.strokeAlign,
    rx: style.cornerRadius || 0,
    ry: style.cornerRadius || 0,
    visible: true,
  });
};

export { renderRect, renderImg };
