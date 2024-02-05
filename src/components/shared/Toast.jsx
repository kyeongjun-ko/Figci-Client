import { useEffect } from "react";
import styled, { keyframes } from "styled-components";

import DELAY_TIME from "../constants/timeConstants";

function ToastPopup({ message, setToast, status }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      setToast(false);
    }, DELAY_TIME.TOAST);

    return () => {
      clearTimeout(timer);
    };
  }, [setToast]);

  return (
    <Toast>
      {status ? (
        <p>{`status code: ${status} messages: ${message}`}</p>
      ) : (
        <p>{message}</p>
      )}
    </Toast>
  );
}

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Toast = styled.div`
  position: absolute;
  z-index: 2;
  top: 85%;

  display: flex;
  justify-content: center;
  align-items: center;
  width: 900px;
  height: 70px;
  font-weight: 700;
  border-radius: 20px;
  animation: ${fadeInUp} 0.5s ease-in-out;

  opacity: 0.8;
  background-color: #000000;
  color: #ffffff;
  font-family: "Noto Sans KR";
  font-size: 18px;
  text-align: center;
`;

export default ToastPopup;
