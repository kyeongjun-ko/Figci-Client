import React from "react";
import styled from "styled-components";

import Title from "../shared/Title";
import Select from "../shared/Select";
import Footer from "../shared/Footer";

function ProjectVersion() {
  return (
    <StyledContent>
      <div className="content">
        <Title />
        <Select />
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

export default ProjectVersion;
