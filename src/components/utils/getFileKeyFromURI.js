const getFileKeyFromURI = projectURI => {
  const urlObject = new URL(projectURI);
  const urlPathList = urlObject.pathname.split("/").filter(part => part !== "");
  const fileKey = urlPathList[1];

  return fileKey;
};

export default getFileKeyFromURI;
