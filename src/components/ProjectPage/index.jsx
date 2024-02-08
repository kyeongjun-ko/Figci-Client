import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Loading from "../shared/Loading";
import Modal from "../shared/Modal";
import Title from "../shared/Title";
import Select from "../shared/Select";
import BottomNavigator from "../shared/BottomNavigator";
import { getDiffingResult } from "../../services/pages";

import usePageListStore from "../../../store/projectPage";
import usePageStatusStore from "../../../store/projectInit";

function ProjectPage() {
  const [isLoaded, setIsLoaded] = useState(true);
  const [pageList, setPageList] = useState([]);
  const [selectPage, setSelectPage] = useState("");
  const navigate = useNavigate();
  const { status, setStatus } = usePageStatusStore();
  const { byPageIds } = usePageListStore();

  const onChangeHandler = ev => {
    const date = ev.target.value;

    setSelectPage(date);
  };

  const handleSubmitPage = ev => {
    ev.preventDefault();

    const { projectKey, beforeVersion, afterVersion } = status;

    setStatus({ pageId: selectPage });

    const targetPage = {
      projectKey,
      beforeVersion,
      afterVersion,
      nodeId: selectPage,
    };

    try {
      setIsLoaded(false);

      getDiffingResult(targetPage);

      setIsLoaded(true);

      navigate("/result");
    } catch (err) {
      setIsLoaded(false);
    }
  };

  const handleClickPrevButton = ev => {
    ev.preventDefault();

    navigate("/version");
  };

  useEffect(() => {
    const storedPageList = byPageIds;

    setPageList(storedPageList);
  }, []);

  const selectOptionRenderList = () => {
    const optionRenderList = [];
    if (true) {
      for (const pageId in pageList) {
        const pageNode = pageList[pageId];

        optionRenderList.push(
          <option key={pageNode.node_id} value={pageNode.node_id}>
            {pageNode.name}
          </option>,
        );
      }
    }

    return optionRenderList;
  };
  const contents = {
    title: {
      step: "03",
      firstSentence: "비교할 페이지를",
      secondSentence: "선택해주세요.",
    },
    selectInfo: {
      id: "project",
      label: "비교 페이지 선택",
      defaultValue: "비교할 페이지 선택",
      selects: [
        {
          id: "pageSelection",
          value: "pageSelection",
          options: pageList && selectOptionRenderList(),
          onChange: onChangeHandler,
        },
      ],
      description: "이전 버전과 비교할 수 있는 페이지만 보여요!",
    },
    buttons: [
      {
        text: "이전",
        usingCase: "line",
        handleClick: handleClickPrevButton,
      },
      {
        text: "비교하기",
        usingCase: "solid",
        handleClick: handleSubmitPage,
      },
    ],
  };

  return (
    <>
      {!isLoaded && (
        <Modal>
          <Loading />
        </Modal>
      )}
      <ProjectPageWrapper>
        <Title title={contents.title} />
        <Select
          selectInfo={contents.selectInfo}
          onInputChange={onChangeHandler}
        />
        <BottomNavigator buttons={contents.buttons} />
      </ProjectPageWrapper>
    </>
  );
}

const ProjectPageWrapper = styled.div`
  box-sizing: border-box;

  width: 100%;
  height: 100%;
  padding: 64px;
`;
export default ProjectPage;
