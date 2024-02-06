import styled, { css } from "styled-components";

function Title({ title }) {
  return (
    <StyledTitle>
      <h2 className="step">STEP {title.step}</h2>
      <h2 className="title">
        {title.firstSentence}
        <br />
        {title.secondSentence}
      </h2>
    </StyledTitle>
  );
}

const StyledTitle = styled.div`
  h2 {
    font-size: 2rem;
    font-style: normal;
    font-weight: 900;
    line-height: 48px;
    text-align: left;
  }

  .step {
    color: #2623fb;
  }

  .title {
    color: #000000;
  }
`;

export default Title;
