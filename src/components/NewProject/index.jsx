/* eslint-disable consistent-return */
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

import Welcome from "../Welcome";
import Modal from "../shared/Modal";
import Title from "../shared/Title";
import Input from "../shared/Input";
import BottomNavigator from "../shared/BottomNavigator";

import { getToken } from "../../services/auth";
import getVersions from "../../services/versions";
import getProjectKeyFromURI from "../utils/getProjectKeyFromURI";

import useAuthStore from "../../../store/projectAuth";
import useProjectVersionStore from "../../../store/projectVersion";
import usePageStatusStore from "../../../store/projectInit";

function NewProject() {
  const [isModalOpened, setIsModalOpened] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const { setStatus } = usePageStatusStore();
  const { auth, setAuth } = useAuthStore();
  const { setVersion } = useProjectVersionStore();

  const code = query.get("code") || auth.code;
  const state = query.get("state");

  const setVersionList = newVersions => {
    setVersion(newVersions);
  };

  const setAuthStore = authParams => {
    setAuth(authParams);
  };

  const handleModalClick = ev => {
    ev.preventDefault();

    setIsModalOpened(false);
  };

  const handleChangeInput = ev => {
    setInputValue(ev.target.value);
  };

  const handleSubmitURI = async ev => {
    ev.preventDefault();

    const projectKey = getProjectKeyFromURI(inputValue);

    setStatus({ projectKey });
    setVersionList(await getVersions(projectKey));

    navigate("/version");
  };

  useEffect(() => {
    setAuthStore(code);

    const fetchToken = async () => {
      try {
        const authCode = code;

        if (authCode) {
          const accessToken = await getToken(code);

          localStorage.setItem("FigmaToken", JSON.stringify(accessToken));
        }
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

  const contents = {
    title: {
      step: "01",
      firstSentence: "디자인 변경사항을 확인할",
      secondSentence: "피그마 프로젝트 URL을 입력해주세요.",
    },
    inputInfo: {
      id: "project",
      label: "피그마 프로젝트 URL 입력",
      inputs: [
        {
          id: "address",
          placeholder: "url 주소를 입력해주세요. (예: www.figma.com/abc)",
        },
      ],
    },
    buttons: [
      { text: "다음", usingCase: "solid", handleClick: handleSubmitURI },
    ],
  };

  return (
    <>
      {isModalOpened && (
        <Modal>
          <Welcome handleClick={handleModalClick} />
        </Modal>
      )}
      <ContentsWrapper>
        <form>
          <Title title={contents.title} />
          <Input
            inputInfo={contents.inputInfo}
            onInputChange={handleChangeInput}
          />
        </form>
      </ContentsWrapper>
      <BottomNavigator buttons={contents.buttons} />
    </>
  );
}

const ContentsWrapper = styled.div`
  box-sizing: border-box;

  width: 100%;
  height: 100%;
  padding: 64px;
`;

export default NewProject;
