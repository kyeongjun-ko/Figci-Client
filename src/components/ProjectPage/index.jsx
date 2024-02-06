import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../shared/Button";
import { getPages, getPageList} from "../../services/pages";
import Modal from "../shared/Modal";
import Loading from "../shared/Loading";

import useProjectVersionStore from "../../../store/projectVersion";

function ProjectPage() {
  const [isLoaded, setIsLoaded] = useState(true);
  const [beforeDate, setBeforeDate] = useState("");
  const [afterDate, setAfterDate] = useState("");
  const [beforeVersion, setBeforeVersion] = useState("");
  const [afterVersion, setAfterVersion] = useState("");

  const navigate = useNavigate();
  const { allDates, byDates } = useProjectVersionStore(state => state);

  const onChange1 = ev => {
    const date = ev.target.value;

    setBeforeDate(date);
  };

  const onChange2 = ev => {
    const version = ev.target.value;

    setBeforeVersion(version);
  };

  const onChange3 = ev => {
    const date = ev.target.value;

    setAfterDate(date);
  };

  const onChange4 = ev => {
    const version = ev.target.value;

    setAfterVersion(version);
  };

  function dateFilter() {
    if (beforeDate) {
      return allDates.filter(
        dateString => new Date(dateString) < new Date(beforeDate),
      );
    }

    return false;
  }
  const onClickSubmitButton = async ev => {
    ev.preventDefault();

    const result = {
      beforeVersion,
      afterVersion,
    };

    const pageList = getPageList(await getPages(result));

    usePageListStore.getState().setPages(pageList);

    navigate("/version", {
      state: {
        pages: pageList,
      },
    });
  }

  return (
    <>
      <h1>ProjectPage</h1>
      <form>
        {!isLoaded && (
          <Modal>
            <Loading />
          </Modal>
        )}
        <div>
          <label htmlFor="beforeDate">
            이전 날짜
            <select name="beforeDate" id="beforeDate" onChange={onChange1}>
              {allDates.map(date => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="beforeVersion">
            이전 버전
            <select name="beforeVersion" id="beforeVersion" onChange={onChange2}>
              {beforeDate &&
                Object.entries(byDates[beforeDate]).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
            </select>
          </label>
        </div>
        <div>
          <label htmlFor="afterDate">
            이후 날짜
            <select name="afterDate" id="afterDate" onChange={onChange3}>
              {dateFilter() &&
                dateFilter().map(date => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
            </select>
          </label>
          <label htmlFor="afterVersion">
            이후 버전
            <select name="afterVersion" id="afterVersion" onChange={onChange4}>
              {afterDate &&
                Object.entries(byDates[afterDate]).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
            </select>
          </label>
        </div>
        <Button
          disabled={(beforeVersion && afterVersion) === false}
          handleClick={onClickSubmitButton}
          size="medium"
        >
          페이지 입력
        </Button>
      </form>
    </>
  );
}

export default ProjectPage;
