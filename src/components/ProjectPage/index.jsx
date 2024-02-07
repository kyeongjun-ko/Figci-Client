import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import Button from "../shared/Button";
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

  const store = [
    {
      "106:8": {
        name: "nodeType",
        node_id: "106:8",
      },
    },
    {
      "5:5": {
        name: "Page 2",
        node_id: "5:5",
      },
    },
    {
      "0:1": {
        name: "Page 1",
        node_id: "0:1",
      },
    },
  ];

  const onChangeHandler = ev => {
    const date = ev.target.value;

    setSelectPage(date);
  };

  const updatePageId = newPageId => {
    usePageStatusStore.getState().setStatus({ nodeId: newPageId });
  };

  const getStatus = () => {
    return usePageStatusStore.getState().status;
  };

  const onClickSubmitButton = async ev => {
    ev.preventDefault();

    const { fileKey, beforeVersion, afterVersion } = getStatus();

    updatePageId(selectPage);

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
      console.log(err);

      setIsLoaded(false);
    }
  };

  const handleClickPrevButton = ev => {
    ev.preventDefault();

    navigate("/version");
  };

  useEffect(() => {
    setPageList(store);

    // const storedPageList = usePageListStore.getState().allPages;

    // if (storedPageList) {
    //   setPageList(storedPageList);
    // } else {
    // }
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
            pageList.map(Object.entries).map(([nodeId, nodeName]) => (
              <option key={nodeId} value={nodeId}>
                {nodeName}
              </option>
            )),
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
        handleClick: onClickSubmitButton,
        disabled:
          (getStatus().beforeVersion && getStatus().afterVersion) === false,
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
