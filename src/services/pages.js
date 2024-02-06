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

<<<<<<< HEAD
<<<<<<< HEAD
  const responseJson = await response.json();

  return responseJson;
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

const getPageDiff = targetPage => {};

export { getPages, getPageList, getPageDiff };
=======
  return await response.json();
=======
  const responseJson = await response.json();

  return responseJson;
>>>>>>> 🎨 [Style] zustand 상태 저장 데이터 형식 변경
};

<<<<<<< HEAD
export default getPages;
>>>>>>> ✨ [Feat] 버전 정보 입력시 선택 가능 페이지 fetch 요청
=======
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

<<<<<<< HEAD
export { getPages, getPageList };
>>>>>>> ✨ [Feat] 페이지 상태 정규화를 위한 페이지 리스트 추출 유틸 함수 추가
=======
const getPageDiff = targetPage => {};

export { getPages, getPageList, getPageDiff };
>>>>>>> 🎨 [Style] zustand 상태 저장 데이터 형식 변경
