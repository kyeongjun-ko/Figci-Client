const clientId = import.meta.env.VITE_FIGMA_CLIENT_ID;
const clientSecret = import.meta.env.VITE_FIGMA_CLIENT_SECRET;

const baseURI = "https://www.figma.com/";

const path = {
  auth: "oauth?",
  token: "api/oauth/token?",
  redirect: "new",
};
const scope = "file_variables:write";
const state = "randomstring";

const redirectURI = `http://localhost:5173/${path.redirect}`;

const authURI = `${baseURI}${path.auth}client_id=${clientId}&redirect_uri=${redirectURI}&scope=${scope}&state=${state}&response_type=code`;
const tokenURI = `${baseURI}${path.token}client_id=${clientId}&redirect_uri=${redirectURI}&scope=${scope}&state=${state}&response_type=code`;

const login = () => {
  window.location.href = authURI;
};

const getToken = async code => {
  const data = new URLSearchParams();

  data.append("client_id", clientId);
  data.append("client_secret", clientSecret);
  data.append("redirect_uri", redirectURI);
  data.append("code", code);
  data.append("grant_type", "authorization_code");

  // 실제 POST 요청 보내기
  fetch(tokenURI, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: data,
  })
    .then(response => response.json())
    .catch(() => {});
};

export { login, getToken };
