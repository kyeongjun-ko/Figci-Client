<<<<<<< HEAD
<<<<<<< HEAD
import { useState } from "react";
<<<<<<< HEAD
import styled from "styled-components";
=======
=======
=======
>>>>>>> ✨ [Feat] 버전 정보 입력시 선택 가능 페이지 fetch 요청
import { useEffect, useState } from "react";
>>>>>>> ✨ [Feat] 버전정보 페이지 & Page 페이지 라우터 연결 및 zustand 상태 동기화
import { useNavigate } from "react-router-dom";
>>>>>>> ✨ [Feat] 버전 정보 입력시 선택 가능 페이지 fetch 요청

import Button from "../shared/Button";
=======
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../shared/Button";
import useProjectVersionStore from "../../../store/projectVersion";
import getPages from "../../services/pages";
>>>>>>> ✨ [Feat] 버전 정보 입력시 선택 가능 페이지 fetch 요청
import Modal from "../shared/Modal";
import Loading from "../shared/Loading";
<<<<<<< HEAD
import Title from "../shared/Title";
import Select from "../shared/Select";
import BottomNavigator from "../shared/BottomNavigator";

import useProjectVersionStore from "../../../store/projectVersion";
=======
import { getPageDiff } from "../../services/pages";
import usePageListStore from "../../../store/projectPage";
import usePageStatusStore from "../../../store/projectInit";
>>>>>>> ✨ [Feat] 버전정보 페이지 & Page 페이지 라우터 연결 및 zustand 상태 동기화

function ProjectPage() {
  const [isLoaded, setIsLoaded] = useState(true);
<<<<<<< HEAD
  const [pageList, setPageList] = useState([]);
  const [selectPage, setSelectPage] = useState("");
  const navigate = useNavigate();

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

    console.log("targetPage", targetPage);
    console.log("node업데이트 statue", usePageStatusStore.getState().status);

    try {
      setIsLoaded(false);

      const result = getPageDiff(targetPage);

      console.log("페이지 렌더링 리스트", await JSON.parse(result));

      setIsLoaded(true);
      navigate("/result");
    } catch (err) {
      console.log(err);

      setIsLoaded(false);
    }
  };

  useEffect(() => {
    const storedPageList = usePageListStore.getState().allPages;

    if (storedPageList) {
      setPageList(storedPageList);
    } else {
      console.log("pageList 로딩 실패");
    }
  }, []);

  return (
<<<<<<< HEAD
    <>
<<<<<<< HEAD
=======
    <form>
>>>>>>> ✨ [Feat] 버전정보 페이지 & Page 페이지 라우터 연결 및 zustand 상태 동기화
      {!isLoaded && (
        <Modal>
          <Loading />
        </Modal>
      )}
<<<<<<< HEAD
      <ContentsWrapper>
        <Title />
        <Select />
      </ContentsWrapper>
      <BottomNavigator />
=======
      <h1>ProjectPage</h1>
      <form>
        {!isLoaded && (
          <Modal>
            <Loading />
          </Modal>
        )}
        <div>
          <label htmlFor="beforeDate">
            이전 날짜
            <select name="beforeDate" id="beforeDate" onChange={onChange1}>
              {allDates.map(date => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="beforeVersion">
            이전 버전
            <select name="beforeVersion" id="beforeVersion" onChange={onChange2}>
              {beforeDate &&
                Object.entries(byDates[beforeDate]).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
            </select>
          </label>
        </div>
        <div>
          <label htmlFor="afterDate">
            이후 날짜
            <select name="afterDate" id="afterDate" onChange={onChange3}>
              {dateFilter() &&
                dateFilter().map(date => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
            </select>
          </label>
          <label htmlFor="afterVersion">
            이후 버전
            <select name="afterVersion" id="afterVersion" onChange={onChange4}>
              {afterDate &&
                Object.entries(byDates[afterDate]).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
            </select>
          </label>
        </div>
        <Button
          disabled={(beforeVersion && afterVersion) === false}
          handleClick={onClickSubmitButton}
          size="medium"
        >
          페이지 입력
        </Button>
      </form>
>>>>>>> ✨ [Feat] 버전 정보 입력시 선택 가능 페이지 fetch 요청
    </>
=======
      <label htmlFor="selectPage">
        페이지선택
        <select name="selectPage" id="selectPage" onChange={onChangeHandler}>
          {pageList &&
            pageList.map(Object.entries).map(([nodeId, nodeName]) => (
              <option key={nodeId} value={nodeId}>
                {nodeName}
              </option>
            ))}
        </select>
      </label>
      <Button
        disabled={
          (getStatus().beforeVersion && getStatus().afterVersion) === false
        }
        handleClick={onClickSubmitButton}
        size="medium"
      >
        페이지 선택
      </Button>
    </form>
<<<<<<< HEAD
>>>>>>> ✨ [Feat] 버전정보 페이지 & Page 페이지 라우터 연결 및 zustand 상태 동기화
=======
=======
  const [beforeDate, setBeforeDate] = useState("");
  const [afterDate, setAfterDate] = useState("");
  const [beforeVersion, setBeforeVersion] = useState("");
  const [afterVersion, setAfterVersion] = useState("");

  const navigate = useNavigate();
  const { allDates, byDates } = useProjectVersionStore(state => state);

  const onChange1 = ev => {
    const date = ev.target.value;

    setBeforeDate(date);
  };

  const onChange2 = ev => {
    const version = ev.target.value;

    setBeforeVersion(version);
  };

  const onChange3 = ev => {
    const date = ev.target.value;

    setAfterDate(date);
  };

  const onChange4 = ev => {
    const version = ev.target.value;

    setAfterVersion(version);
  };

  function dateFilter() {
    if (beforeDate) {
      return allDates.filter(
        dateString => new Date(dateString) < new Date(beforeDate),
      );
    }

    return false;
  }
  const onClickSubmitButton = async ev => {
    ev.preventDefault();

    const result = await getPages({
      beforeVersion,
      afterVersion,
    });

    navigate("/version", {
      state: {
        pages: result,
      },
    });
  }

  return (
    <>
      <h1>ProjectPage</h1>
      <form>
        {!isLoaded && (
          <Modal>
            <Loading />
          </Modal>
        )}
        <div>
          <label htmlFor="beforeDate">
            이전 날짜
            <select name="beforeDate" id="beforeDate" onChange={onChange1}>
              {allDates.map(date => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="beforeVersion">
            이전 버전
            <select name="beforeVersion" id="beforeVersion" onChange={onChange2}>
              {beforeDate &&
                Object.entries(byDates[beforeDate]).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
            </select>
          </label>
        </div>
        <div>
          <label htmlFor="afterDate">
            이후 날짜
            <select name="afterDate" id="afterDate" onChange={onChange3}>
              {dateFilter() &&
                dateFilter().map(date => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
            </select>
          </label>
          <label htmlFor="afterVersion">
            이후 버전
            <select name="afterVersion" id="afterVersion" onChange={onChange4}>
              {afterDate &&
                Object.entries(byDates[afterDate]).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
            </select>
          </label>
        </div>
        <Button
          disabled={(beforeVersion && afterVersion) === false}
          handleClick={onClickSubmitButton}
          size="medium"
        >
          페이지 입력
        </Button>
      </form>
    </>
>>>>>>> ✨ [Feat] 버전 정보 입력시 선택 가능 페이지 fetch 요청
>>>>>>> ✨ [Feat] 버전 정보 입력시 선택 가능 페이지 fetch 요청
  );
}

const ContentsWrapper = styled.div`
  box-sizing: border-box;

  width: 100%;
  height: 100%;
  padding: 64px;
`;

export default ProjectPage;
