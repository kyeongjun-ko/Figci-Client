import { Routes, Route } from "react-router-dom";

import Onboarding from "./Onboarding";
import NewProejct from "./NewProject";
import ProjectVersion from "./ProjectVersion";
import ProjectPage from "./ProjectPage";
import DiffingResult from "./DiffingResult";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/new" element={<NewProejct />} />
      <Route path="/version" element={<ProjectVersion />} />
      <Route path="/page" element={<ProjectPage />} />
      <Route path="/result" element={<DiffingResult />} />
    </Routes>
  );
}

export default App;
