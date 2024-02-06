import { useState } from "react";
import styled from "styled-components";

import Modal from "../shared/Modal";
import Loading from "../shared/Loading";
import Title from "../shared/Title";
import Select from "../shared/Select";
import Footer from "../shared/Footer";

function ProjectPage() {
  const [isLoaded, setIsLoaded] = useState(true);

  return (
    <StyledContent>
      {!isLoaded && (
        <Modal>
          <Loading />
        </Modal>
      )}
      <div className="content">
        <Title />
        <Select />
      </div>
      <Footer />
    </StyledContent>
  );
}

const StyledContent = styled.div`
  .content {
    box-sizing: border-box;

    width: 100%;
    height: 100%;
    padding: 64px;
  }
`;

export default ProjectPage;
