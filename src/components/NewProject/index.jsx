/* eslint-disable consistent-return */

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Modal from "../shared/Modal";
import Welcome from "../Welcome";
import Button from "../shared/Button";
import getVersions from "../../services/versions";
import { getToken } from "../../services/auth";

import useProjectVersionStore from "../../../store/projectVersion";

function NewProject() {
  const [isModalOpened, setIsModalOpened] = useState(true);
  const [uriText, setUriText] = useState("");
  const navigate = useNavigate();
  const [query] = useSearchParams();

  const { setVersion } = useProjectVersionStore(state => state);

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

  const handleClick = ev => {
    ev.preventDefault();

    setIsModalOpened(false);
  }

  const onClickSubmitButton = async e => {
    e.preventDefault();

    setVersion(await getVersions(uriText));

    navigate("/page");
  };

  return (
    <>
      <h1>hello</h1>
      {isModalOpened && (
        <Modal>
          <Welcome handleClick={handleClick} />
        </Modal>
      )}
      <form>
        <Input
          value={uriText}
          onChange={e => setUriText(e.target.value)}
        ></Input>
        <Button handleClick={onClickSubmitButton} size="medium">
          페이지 입력
        </Button>
      </form>
    </>
  );
}

const Input = styled.input`
  width: 600px;
  height: 50px;
`;

export default NewProject;
