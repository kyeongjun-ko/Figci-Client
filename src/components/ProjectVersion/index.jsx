import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Loading from "../shared/Loading";
import Modal from "../shared/Modal";
import Title from "../shared/Title";
import Select from "../shared/Select";
import BottomNavigator from "../shared/BottomNavigator";
import { getPages } from "../../services/pages";

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

  const { allDates, byDates } = useProjectVersionStore();

  const { status, setStatus, clearProject } = usePageStatusStore();
  const { setPages } = usePageListStore();

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

  const filterNextDates = () => {
    if (beforeDate) {
      return allDates.filter(
        dateString => new Date(dateString) > new Date(beforeDate),
      );
    }

    return false;
  };

  const handleClickPrevButton = ev => {
    ev.preventDefault();

    clearProject();

    navigate(-1);
  };

  const handleSubmitNextButton = async ev => {
    ev.preventDefault();

    setIsLoaded(false);

    const selectVersions = {
      beforeVersion,
      afterVersion,
    };

    setStatus(selectVersions);

    const pageList = await getPages(status.projectKey, selectVersions);

    setPages(pageList);

    setIsLoaded(true);
    navigate("/page");
  };

  const prevVersionForm = {
    label: "이전 버전",
    description: "지정한 버전 명이 없으면 시간으로 보여요!",
    selects: [
      {
        id: "beforeDate",
        onChange: onChangeBeforeDate,
        options: allDates.map(date => (
          <option key={date} value={date}>
            {date}
          </option>
        )),
      },
      {
        id: "beforeVersion",
        onChange: onChangeBeforeVersion,
        options:
          beforeDate &&
          Object.entries(byDates[beforeDate]).map(([key, value]) => (
            <option key={value.label} value={key}>
              {value.label}
            </option>
          )),
      },
    ],
  };

  const nextVersionForm = {
    label: "이후 버전",
    description: "지정한 버전 명이 없으면 시간으로 보여요!",
    selects: [
      {
        id: "afterDate",
        onChange: onChangeAfterDate,
        options:
          filterNextDates() &&
          filterNextDates().map(date => (
            <option key={date} value={date}>
              {date}
            </option>
          )),
      },
      {
        id: "afterVersion",
        onChange: onChangeAfterVersion,
        options:
          afterDate &&
          Object.entries(byDates[afterDate]).map(([key, value]) => (
            <option key={value.label} value={key}>
              {value.label}
            </option>
          )),
      },
    ],
  };

  const contents = {
    title: {
      step: "02",
      firstSentence: "비교할 해당 피그마 파일의",
      secondSentence: "이전 / 최신 버전을 입력해 주세요",
    },
    buttons: [
      { text: "이전", usingCase: "solid", handleClick: handleClickPrevButton },
      { text: "다음", usingCase: "solid", handleClick: handleSubmitNextButton },
    ],
  };

  return (
    <>
      {!isLoaded && (
        <Modal>
          <Loading />
        </Modal>
      )}
      <ContentsWrapper>
        <Title title={contents.title} />
        <HorizontalAlign>
          <Select selectInfo={prevVersionForm} />
          <Select selectInfo={nextVersionForm} />
        </HorizontalAlign>
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

const HorizontalAlign = styled.form`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  width: 100%;
`;

export default ProjectVersion;
