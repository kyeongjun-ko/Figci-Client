import { Routes, Route } from "react-router-dom";

import Onboarding from "./Onboarding";
import NewProejct from "./NewProject";
import DiffingResult from "./DiffingResult";
import ProjectPage from "./ProjectPage";
import ProjectVersion from "./ProjectVersion";

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
