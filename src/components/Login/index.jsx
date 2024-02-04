import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../../services/auth";

const Button = styled.button`
  width: 300px;
  height: 50px;
  background-color: #3551df;
  color: white;
  text-align: center;
  margin: 20px 0;
`;
const Text = styled.div`
  width: 100px;
  height: 100px;
  background-color: #c5e4e4;
  color: black;
`;
const Input = styled.input`
  width: 300px;
  height: 40px;
  color: black;
  text-align: center;
  font-size: 20px;
  font-weight: 800;
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;

function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const onClickHandler = function clickHandler() {
    navigate(login());
  };

  return (
    <Layout>
      <h1>Login Page</h1>
      <form>
        {/* <label id="usernameId" htmlFor="username">아이디</label> */}
        <Input
          id="username"
          type="text"
          value={userId}
          onClick={() => setUserId("")}
          onChange={e => setUserId(e.target.value)}
        ></Input>
        {/* <label id="usernameId" htmlFor="password">비밀번호</label> */}
        <Input
          id="password"
          type="password"
          value={password}
          onClick={() => setPassword("")}
          onChange={e => setPassword(e.target.value)}
        ></Input>
        <Button onClick={onClickHandler}>Login</Button>
      </form>
      <Text>result</Text>
    </Layout>
  );
}

export default Login;
