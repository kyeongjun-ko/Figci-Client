import { Link } from "react-router-dom";
import styled from "styled-components";

function Header() {
  return (
    <Wrapper>
      <Link to="/">
        <img
          className="logo"
          src="../../assets/logo_figci.jpg"
          alt="figci-logo-img"
        />
      </Link>
      <span className="slogan">
        피그마 버전을 비교해
        <br />
        디자인 변경사항을 한눈에!
      </span>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 64px;

  .logo {
    width: 70px;
    margin-right: 21px;
  }

  .slogan {
    color: #000;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
  }
`;

export default Header;
