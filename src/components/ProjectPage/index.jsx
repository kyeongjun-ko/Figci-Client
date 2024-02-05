import { useState } from "react";

import Modal from "../shared/Modal";
import Loading from "../shared/Loading";

function ProjectPage() {
  const [isLoaded, setIsLoaded] = useState(true);

  return (
    <>
      <h1>ProjectPage</h1>
      {!isLoaded && (
        <Modal>
          <Loading />
        </Modal>
      )}
    </>
  );
}

export default ProjectPage;
