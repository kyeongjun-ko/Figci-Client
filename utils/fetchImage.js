const fetchImageUrl = async function fetchFigmaAPI(projectKey) {
  const baseFigmaURL = `/v1/files/${projectKey}/images`;
  const token = JSON.parse(localStorage.getItem("FigmaToken")).access_token;

  const fetchFrameImageURLs = async () => {
    const fetchData = await fetch(baseFigmaURL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const fetchJson = await fetchData.json();

    return fetchJson.meta.images;
  };

  const imageURLs = await fetchFrameImageURLs();

  return imageURLs;
};

export default fetchImageUrl;
