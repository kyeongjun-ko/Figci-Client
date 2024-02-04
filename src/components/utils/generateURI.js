function generateApiUri(baseUrl, endpoint, queryParams) {
  const apiUri = new URL(endpoint, baseUrl);

  if (queryParams) {
    Object.keys(queryParams).forEach(key => {
      apiUri.searchParams.append(key, queryParams[key]);
    });
  }

  return apiUri.toString();
}

export default generateApiUri;
