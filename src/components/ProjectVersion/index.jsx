import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import BottomNavigator from "../shared/BottomNavigator";
import Title from "../shared/Title";
import Select from "../shared/Select";
import Button from "../shared/Button";
import Modal from "../shared/Modal";
import Loading from "../shared/Loading";
import { getPages, getPageList } from "../../services/pages";

import useProjectVersionStore from "../../../store/projectVersion";
import usePageListStore from "../../../store/projectPage";
import usePageStatusStore from "../../../store/projectInit";

function ProjectVersion() {
  const [isLoaded, setIsLoaded] = useState(true);
  const [beforeDate, setBeforeDate] = useState("");
  const [afterDate, setAfterDate] = useState("");
  const [beforeVersion, setBeforeVersion] = useState("");
  const [afterVersion, setAfterVersion] = useState("");
  const navigate = useNavigate();

  const { allDates, byDates } = useProjectVersionStore(state => state);

  const onChangeBeforeDate = ev => {
    const date = ev.target.value;

    setBeforeDate(date);
  };

  const onChangeBeforeVersion = ev => {
    const version = ev.target.value;

    setBeforeVersion(version);
  };

  const onChangeAfterDate = ev => {
    const date = ev.target.value;

    setAfterDate(date);
  };

  const onChangeAfterVersion = ev => {
    const version = ev.target.value;

    setAfterVersion(version);
  };

  const dateFilter = () => {
    if (beforeDate) {
      return allDates.filter(
        dateString => new Date(dateString) > new Date(beforeDate),
      );
    }

    return false;
  };

  const updateVersions = (prevVersion, nextVersion) => {
    usePageStatusStore.getState().setStatus({
      beforeVersion: prevVersion,
      afterVersion: nextVersion,
    });
  };

  const onClickSubmitButton = async ev => {
    ev.preventDefault();

    const result = {
      beforeVersion,
      afterVersion,
    };

    updateVersions(beforeVersion, afterVersion);

    const pageLists = await getPages(result);
    console.log("pageLists", pageLists);
    const pageList = getPageList(pageLists);
    console.log("pageList", pageList);

    usePageListStore.getState().setPages(pageList);

    navigate("/page", {
      state: {
        pages: pageList,
      },
    });
  };

  return (
    <>
          <ContentsWrapper>
        <Title />
        <Select />
        <Select />
      </ContentsWrapper>
      <BottomNavigator />
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
            <select
              name="beforeDate"
              id="beforeDate"
              onChange={onChangeBeforeDate}
            >
              {allDates.map(date => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="beforeVersion">
            이전 버전
            <select
              name="beforeVersion"
              id="beforeVersion"
              onChange={onChangeBeforeVersion}
            >
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
            <select
              name="afterDate"
              id="afterDate"
              onChange={onChangeAfterDate}
            >
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
            <select
              name="afterVersion"
              id="afterVersion"
              onChange={onChangeAfterVersion}
            >
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
          버전 선택
        </Button>
      </form>
    </>
  );
}

const ContentsWrapper = styled.div`
  box-sizing: border-box;

  width: 100%;
  height: 100%;
  padding: 64px;
`;

export default ProjectVersion;
