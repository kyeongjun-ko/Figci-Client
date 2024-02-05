function generateApiUri(baseUri, endpoint, queryParams) {
  const apiUri = new URL(endpoint, baseUri);

  if (queryParams) {
    Object.keys(queryParams).forEach(key => {
      apiUri.searchParams.append(key, queryParams[key]);
    });
  }

  return apiUri.toString();
}

export default generateApiUri;
