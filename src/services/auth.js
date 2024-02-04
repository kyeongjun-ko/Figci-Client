import generateApiUri from "../components/utils/generateURI";

const clientId = import.meta.env.VITE_FIGMA_CLIENT_ID;
const clientSecret = import.meta.env.VITE_FIGMA_CLIENT_SECRET;

const apiBaseURI = "https://www.figma.com/";
const redirectURI = `http://localhost:5173/new`;

const getAuth = () => {
  const queryParams = {
    client_id: clientId,
    redirect_uri: redirectURI,
    scope: "file_variables:write",
    state: "randomstring",
    response_type: "code",
  };

  const API_URI = generateApiUri(apiBaseURI, "oauth", queryParams);

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

  const API_URI = generateApiUri(apiBaseURI, "api/oauth/token", queryParams);

  fetch(API_URI, { method: "POST" })
    .then(response => response.json())
    .catch(() => {});
};

export { getAuth, getToken };
