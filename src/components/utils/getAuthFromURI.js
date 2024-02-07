function getAuthFromURI() {
  const params = new URL(window.location.href).searchParams;

  if (params.get("code")) {
    return {
      code: params.get("code"),
      state: params.get("state"),
    };
  }
  return false;
}

export default getAuthFromURI;
