import { useLocation, useSearchParams } from "react-router-dom";
import { getToken, login } from "../../services/auth";

function NewProejct() {
  const location = useLocation();
  const query = location.search;

  const [searchParams, setSearchParams] = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  console.log("code", getToken(code));

  return <h1>NewProject Page</h1>;
}

export default NewProejct;
