/* eslint-disable consistent-return */

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Modal from "../shared/Modal";
import Welcome from "../Welcome";

import { getToken } from "../../services/auth";

function NewProject() {
  const [isModalOpened, setIsModalOpened] = useState(true);
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
    };

    if (state !== import.meta.env.VITE_FIGMA_OAUTH_STATE) {
      navigate("/", {
        state: {
          status: 401,
          message: "로그인에 실패하였습니다.",
        },
      });
    }

    fetchToken();
  }, []);

  function handleClick(ev) {
    ev.preventDefault();

    setIsModalOpened(false);
  }

  return (
    <>
      <h1>hello</h1>
      {isModalOpened && (
        <Modal>
          <Welcome handleClick={handleClick} />
        </Modal>
      )}
    </>
  );
}

export default NewProject;
