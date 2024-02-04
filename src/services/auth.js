import generateApiUri from "../components/utils/generateURI";

const clientId = import.meta.env.VITE_FIGMA_CLIENT_ID;
const clientSecret = import.meta.env.VITE_FIGMA_CLIENT_SECRET;
const baseURI = import.meta.env.VITE_FIGMA_BASE_API_URL;
const redirectURI = import.meta.env.VITE_FIGMA_REDIRECT_URL;

const getAuth = () => {
  const queryParams = {
    client_id: clientId,
    redirect_uri: redirectURI,
    scope: "file_variables:write",
    state: "randomstring",
    response_type: "code",
  };

  const API_URI = generateApiUri(baseURI, "oauth", queryParams);

  window.location.href = API_URI;
};

const getToken = async authCode => {
  const queryParams = {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectURI,
    code: authCode,
    grant_type: "authorization_code",
  };

  const API_URI = generateApiUri(baseURI, "api/oauth/token", queryParams);

  const response = await fetch(API_URI, { method: "POST" });
  const responseJson = response.json();

  return responseJson;
};

export { getAuth, getToken };
