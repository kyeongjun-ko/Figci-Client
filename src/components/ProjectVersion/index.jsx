import React from "react";
import styled from "styled-components";

import Title from "../shared/Title";
import Select from "../shared/Select";
import BottomNavigator from "../shared/BottomNavigator";

function ProjectVersion() {
  return (
    <>
      <ContentsWrapper>
        <Title />
        <Select />
        <Select />
      </ContentsWrapper>
      <BottomNavigator />
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
