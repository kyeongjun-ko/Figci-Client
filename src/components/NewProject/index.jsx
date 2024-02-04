import { useNavigate, useSearchParams } from "react-router-dom";

import { useEffect } from "react";
import { getToken } from "../../services/auth";

function NewProejct() {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const code = query.get("code");
  const state = query.get("state");

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getToken(code);
        console.log("accessToken", JSON.stringify(accessToken));

        localStorage.setItem("FigmaToken", JSON.stringify(accessToken));
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    if (state === "randomstring") {
      fetchToken();
    } else {
      navigate("/");
    }
  }, []);

  return <h1>NewProject Page</h1>;
}

export default NewProejct;
