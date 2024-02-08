import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Modal from "../shared/Modal";
import Title from "../shared/Title";
import Select from "../shared/Select";
import BottomNavigator from "../shared/BottomNavigator";

import Loading from "../shared/Loading";
import { getPageDiff } from "../../services/pages";

import usePageListStore from "../../../store/projectPage";
import usePageStatusStore from "../../../store/projectInit";

function ProjectPage() {
  const [isLoaded, setIsLoaded] = useState(true);
  const [pageList, setPageList] = useState([]);
  const [selectPage, setSelectPage] = useState("");
  const navigate = useNavigate();
  const { status, setStatus } = usePageStatusStore();
  const { allPageIds } = usePageListStore();

  const onChangeHandler = ev => {
    const date = ev.target.value;

    setSelectPage(date);
  };

  const handleSubmitVersion = async ev => {
    ev.preventDefault();

    const { fileKey, beforeVersion, afterVersion } = status;

    setStatus({ nodeId: selectPage });

    const targetPage = {
      fileKey,
      beforeVersion,
      afterVersion,
      nodeId: selectPage,
    };

    try {
      setIsLoaded(false);

      getPageDiff(targetPage);

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
    const storedPageList = allPageIds;

    setPageList(storedPageList);
  }, []);

  const contents = {
    title: {
      step: "03",
      firstSentence: "비교할 페이지를",
      secondSentence: "선택해주세요.",
    },
    selectInfo: {
      id: "project",
      label: "비교 페이지 선택",
      selects: [
        {
          id: "pageSelection",
          value: "pageSelection",
          defaultValue: "비교할 페이지 선택",
          options:
            pageList &&
            pageList.map(Object.entries).map(e => {
              const [nodeId, nodeName] = e[0];

              return (
                <option key={nodeId} value={nodeId}>
                  {nodeName.name}
                </option>
              );
            }),
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
        handleClick: handleSubmitVersion,
        disabled: (status.beforeVersion && status.afterVersion) === false,
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
