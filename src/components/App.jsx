import { Routes, Route } from "react-router-dom";
import { Reset } from "styled-reset";

import DiffingResult from "./DiffingResult";
import Login from "./Login";
import NewProejct from "./NewProject";
import Onboarding from "./Onboarding";
import ProjectPage from "./ProjectPage";
import ProjectVersion from "./ProjectVersion";

function App() {
  return (
    <>
      <Reset />
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/new" element={<NewProejct />} />
        <Route path="/version" element={<ProjectVersion />} />
        <Route path="/page" element={<ProjectPage />} />
        <Route path="/result" element={<DiffingResult />} />
      </Routes>
    </>
  );
}

export default App;
