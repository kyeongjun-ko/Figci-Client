const sortNodes = frameChildren => {
  return Object.keys(frameChildren).sort((a, b) => {
    const aHasI = a.includes("I");
    const bHasI = b.includes("I");

    if (aHasI && !bHasI) {
      return 1;
    }

    if (!aHasI && bHasI) {
      return -1;
    }

    const [prevA, nextA] = a.split(":");
    const [prevB, nextB] = b.split(":");

    return prevA - prevB || nextA - nextB;
  });
};

export default sortNodes;
