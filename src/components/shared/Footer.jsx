import styled from "styled-components";

import Button from "./Button";

function Footer({ buttons }) {
  return (
    <StyledFooter>
      {buttons.map(button => (
        <Button
          key={button.text}
          handleClick={button.handleClick}
          size="medium"
          usingCase={button.usingCase}
        >
          {button.text}
        </Button>
      ))}
    </StyledFooter>
  );
}

const StyledFooter = styled.footer`
  box-sizing: border-box;
  position: absolute;
  bottom: 0px;

  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  padding: 24px 40px;
  border-top: 2px solid;
`;

export default Footer;
