import { Route, Routes } from "react-router-dom";
import { Reset } from "styled-reset";

import Onboarding from "./Onboarding";
import NewProject from "./NewProject";
import ProjectVersion from "./ProjectVersion";
import ProjectPage from "./ProjectPage";
import DiffingResult from "./DiffingResult";

function App() {
  return (
    <>
      <Reset />
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/new" element={<NewProject />} />
        <Route path="/version" element={<ProjectVersion />} />
        <Route path="/page" element={<ProjectPage />} />
        <Route path="/result" element={<DiffingResult />} />
      </Routes>
    </>
  );
}

export default App;
