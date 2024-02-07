import styled from "styled-components";

import Button from "./Button";

function BottomNavigator({ buttons }) {
  return (
    <BottomNavWrapper>
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
    </BottomNavWrapper>
  );
}

const BottomNavWrapper = styled.div`
  box-sizing: border-box;
  position: absolute;
  bottom: 0px;

  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 24px 48px;
  border-top: 2px solid;

  button {
    margin-left: 16px;
  }
`;

export default BottomNavigator;
