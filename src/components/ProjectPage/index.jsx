import { useState } from "react";
import styled from "styled-components";

import Modal from "../shared/Modal";
import Loading from "../shared/Loading";
import Title from "../shared/Title";
import Select from "../shared/Select";
import BottomNavigator from "../shared/BottomNavigator";

function ProjectPage() {
  const [isLoaded, setIsLoaded] = useState(true);

  return (
    <>
      {!isLoaded && (
        <Modal>
          <Loading />
        </Modal>
      )}
      <ContentsWrapper>
        <Title />
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

export default ProjectPage;
