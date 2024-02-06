/* eslint-disable consistent-return */

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";

import Modal from "../shared/Modal";
import Welcome from "../Welcome";
import Title from "../shared/Title";
import Input from "../shared/Input";
import BottomNavigator from "../shared/BottomNavigator";

import Button from "../shared/Button";
import getVersions from "../../services/versions";
import { getToken } from "../../services/auth";

import useProjectVersionStore from "../../../store/projectVersion";

function NewProject() {
  const [isModalOpened, setIsModalOpened] = useState(true);
  const [inputValue, setInputValue] = useState("");
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
  };

  const handleInputChange = ev => {
    setInputValue(ev.target.value);
  };

  const handleSubmitInputValue = ev => {
    ev.preventDefault();

    navigate("/version");
  };

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
      { text: "다음", usingCase: "solid", handleClick: handleSubmitInputValue },
    ],
  };

  const onClickSubmitButton = async e => {
    e.preventDefault();

    setVersion(await getVersions(uriText));

    navigate("/page");
  };

  return (
    <>
      {isModalOpened && (
        <Modal>
          <Welcome handleClick={handleClick} />
        </Modal>
      )}
      <ContentsWrapper>
        <Title title={contents.title} />
        <Input
          inputInfo={contents.inputInfo}
          onInputChange={handleInputChange}
        />
      </ContentsWrapper>
      <BottomNavigator buttons={contents.buttons} />
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

const ContentsWrapper = styled.div`
  .content {
    box-sizing: border-box;

    width: 100%;
    height: 100%;
    padding: 64px;
  }
`
const Input = styled.input`
  width: 600px;
  height: 50px;
`

export default NewProject;
