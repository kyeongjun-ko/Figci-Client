import generateApiUri from "../components/utils/generateURI";

const getPages = async ({ beforeVersion, afterVersion }) => {
  const baseURI = import.meta.env.VITE_BACKEND_BASE_API_URI;
  const fileKey = import.meta.env.VITE_FIGMA_DEV_FILE_KEY;
  const token = JSON.parse(localStorage.getItem("FigmaToken")).access_token;

  const queryParams = {
    "before-version": beforeVersion,
    "after-version": afterVersion,
  };

  const API_URI = generateApiUri(
    baseURI,
    `projects/${fileKey}/pages`,
    queryParams,
  );

  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      authorization: token,
    },
  });

  return await response.json();
};

const getPageList = pageList => {
  const result = [];

  pageList.forEach(page => {
    const pageStatus = {
      pageId: page.pageId,
      name: page.name,
      _id: page._id,
    };

    result.push(pageStatus);
  });

  return result;
};

export { getPages, getPageList };
