/* eslint-disable consistent-return */
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";

import Modal from "../shared/Modal";
import Welcome from "../Welcome";
import Title from "../shared/Title";
import Input from "../shared/Input";
import BottomNavigator from "../shared/BottomNavigator";

import { getToken } from "../../services/auth";
import getVersions from "../../services/versions";
import getFileKeyFromURI from "../utils/getFileKeyFromURI";
import getAuthFromURI from "../utils/getAuthFromURI";

import useProjectVersionStore from "../../../store/projectVersion";
import usePageStatusStore from "../../../store/projectInit";
import useAuthStore from "../../../store/projectAuth";

function NewProject() {
  const [isModalOpened, setIsModalOpened] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const [query] = useSearchParams();

  const code = query.get("code");
  const state = query.get("state");

  const updateFileKey = newFileKey => {
    usePageStatusStore.getState().setStatus({ fileKey: newFileKey });
  };

  const updateVersions = newVersions => {
    useProjectVersionStore.getState().setVersion(newVersions);
  };

  const handleModalClick = ev => {
    ev.preventDefault();

    setIsModalOpened(false);
  };

  const handleInputChange = ev => {
    setInputValue(ev.target.value);
  };

  const onClickSubmitButton = async ev => {
    ev.preventDefault();

    const fileKey = getFileKeyFromURI(inputValue);

    updateFileKey(fileKey);
    updateVersions(await getVersions(fileKey));

    navigate("/version");
  };

  const setAuthStore = authParams => {
    useAuthStore.getState().setAuth(authParams);
  };

  useEffect(() => {
    setAuthStore(getAuthFromURI());

    const fetchToken = async () => {
      try {
        const authCode = code || useAuthStore.getState().auth.code;

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
      { text: "다음", usingCase: "solid", handleClick: onClickSubmitButton },
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
            onInputChange={handleInputChange}
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
