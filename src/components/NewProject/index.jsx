import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getToken } from "../../services/auth";

function NewProject() {
  const navigate = useNavigate();
  const [query] = useSearchParams();

  const code = query.get("code");
  const state = query.get("state");

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getToken(code);

        localStorage.setItem("FigmaToken", JSON.stringify(accessToken));
      } catch (err) {
        navigate("/", {
          state: {
            status: 401,
            message: "로그인에 실패하였습니다.",
          },
        });
      }

      return undefined;
    };

    if (state !== import.meta.env.VITE_FIGMA_OAUTH_STATE) {
      navigate("/", {
        state: {
          status: 401,
          message: "로그인에 실패하였습니다.",
        },
      });

      return undefined;
    }

    fetchToken();

    return undefined;
  }, []);

  return <h1>NewProject Page</h1>;
}

export default NewProject;
