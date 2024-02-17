import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fabric } from "fabric";
import styled from "styled-components";

import Modal from "../shared/Modal";
import Loading from "../shared/Loading";
import Sidebar from "../Sidebar";
import Button from "../shared/Button";
import Description from "../shared/Description";
import ToastPopup from "../shared/Toast";

import useProjectStore from "../../../store/project";
import useProjectVersionStore from "../../../store/projectVersion";
import getDiffingResultQuery from "../../../services/getDiffingResultQuery";

import figciLogo from "../../../assets/logo_figci.png";
import typeMapper from "../../../services/createFabricObjects";

function DiffingResult() {
  const [frameList, setFrameList] = useState([]);
  const [frameId, setFrameId] = useState("");
  const [frameName, setFrameName] = useState("");
  const [toast, setToast] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [lastCoord, setLastCoord] = useState({ lastX: 0, lastY: 0 });
  const [isClickedNewVersion, setIsClickedNewVersion] = useState(false);

  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const versionStatus = useProjectVersionStore(state => state.byDates);
  const {
    projectKey,
    projectUrl,
    beforeDate,
    beforeVersion,
    afterDate,
    afterVersion,
    pageId,
  } = useProjectStore(state => state.project);

  const {
    isLoading,
    data: diffingResult,
    isError,
    error,
  } = getDiffingResultQuery(projectKey, beforeVersion, afterVersion, pageId);

  if (isError) {
    setToast({ status: true, message: error.toString() });

    return;
  }

  const getVersionLabel = (date, versionId) => {
    if (versionStatus[date] && versionStatus[date][versionId]) {
      return `${date} ${versionStatus[date][versionId].label}`;
    }

    return null;
  };

  const beforeVersionLabel = getVersionLabel(beforeDate, beforeVersion);
  const afterVersionLabel = getVersionLabel(afterDate, afterVersion);

  const matchType = async (el, number) => {
    if (!el.type) {
      const getDefaultFunction = typeMapper.RECTANGLE;
      const fabricObject = await getDefaultFunction(el, number);

      return fabricObject;
    }

    const getTypeFunction = typeMapper[el.type];

    if (getTypeFunction) {
      const fabricObject = await getTypeFunction(el, number);

      return fabricObject;
    }
  };

  const renderFabricFrame = async frameJSON => {
    const baseFigmaURL = `/v1/files/${projectKey}/images`;
    const token = JSON.parse(localStorage.getItem("FigmaToken")).access_token;

    const requestFetch = async () => {
      const fetchData = await fetch(baseFigmaURL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchJson = await fetchData.json();

      return fetchJson.meta.images;
    };

    const imageURLs = await requestFetch();

    const fabricObject = new Map();

    const fixCoord = frameSubtree => {
      const { x, y } = frameSubtree.property.absoluteBoundingBox;

      const result = {
        dx: x < 0 ? Math.abs(x) + 50 : -1 * x + 20,
        dy: y < 0 ? Math.abs(y) + 50 : -1 * y + 20,
      };

      return result;
    };

    const parent = await matchType(frameJSON, fixCoord(frameJSON));

    parent.stroke = "black";
    parent.strokeWidth = 2;

    fabricObject.set(frameJSON.frameId, parent);

    for (const nodeId in frameJSON.nodes) {
      if (frameJSON.nodes[nodeId].property.fills[0]?.imageRef) {
        const { imageRef } = frameJSON.nodes[nodeId].property.fills[0];

        if (imageURLs[imageRef]) {
          frameJSON.nodes[nodeId].property.imageURL = imageURLs[imageRef];
        }
      }

      fabricObject.set(
        nodeId,
        await matchType(frameJSON.nodes[nodeId], fixCoord(frameJSON)),
      );
    }

    for (const nodeId in frameJSON.nodes) {
      const targetNode = frameJSON.nodes[nodeId];
      const childrenIds = [];

      if (
        targetNode.property.clipsContent &&
        targetNode.property.clipsContent === true
      ) {
        fabricObject.get(nodeId).absolutePositioned = true;

        targetNode.property.overrides?.forEach(node => {
          if (node.overriddenFields.includes("fills")) {
            childrenIds.push(node.id);
          }
        });
      }

      while (childrenIds.length) {
        const clipTargetId = childrenIds.pop();

        fabricObject.get(clipTargetId).clipPath = fabricObject.get(nodeId);
      }
    }

    if (frameJSON.property.clipsContent === true) {
      fabricObject.get(frameJSON.frameId).absolutePositioned = true;

      for (const nodeId in fabricObject) {
        if (
          nodeId !== frameJSON.frameId &&
          !fabricObject.get(nodeId)?.clipPath
        ) {
          fabricObject.get(nodeId).clipPath = fabricObject.get(
            frameJSON.frameId,
          );
        }
      }
    }

    const fabricObjectArray = [...fabricObject.values()];
    const objectGroup = new fabric.Group(fabricObjectArray);

    canvasRef.current.add(objectGroup);
  };

  const renderFabricDifference = async differences => {
    const fixCoord = frameSubtree => {
      const { x, y } = frameSubtree.property.absoluteBoundingBox;

      const result = {
        dx: x < 0 ? Math.abs(x) + 50 : -1 * x + 20,
        dy: y < 0 ? Math.abs(y) + 50 : -1 * y + 20,
      };

      return result;
    };

    const fixOffset = fixCoord(diffingResult.content.frames[frameId]);

    const differenceArray = [];
    for (const nodeId in differences) {
      if (differences[nodeId].frameId === frameId) {
        const fabricObjects = await matchType(differences[nodeId], fixOffset);

        if (fabricObjects?.length > 0) {
          const [rectObject, textObject] = fabricObjects;

          rectObject.on("mouseover", () => {
            rectObject.set({
              fill: "rgba(180, 46, 46, 0.7)",
            });
            textObject.set({
              visible: true,
            });
            canvasRef.current.renderAll();
          });

          rectObject.on("mouseout", () => {
            rectObject.set({
              fill: "rgba(255, 255, 255, 0)",
            });
            textObject.set({
              visible: false,
            });
            canvasRef.current.renderAll();
          });

          differenceArray.push(rectObject);
          differenceArray.push(textObject);
        } else {
          differenceArray.push(fabricObjects);
        }
      }
    }
    if (differenceArray?.length > 0) {
      differenceArray.forEach(obj => {
        canvasRef.current.add(obj);
        obj.bringToFront();
      });
    }

    canvasRef.current.renderAll();
  };

  const handleFrameClick = ev => {
    ev.preventDefault();

    setFrameId(ev.target.getAttribute("data-id"));
    setFrameName(ev.target.getAttribute("data-name"));
  };

  useEffect(() => {
    const initCanvas = () =>
      (canvasRef.current = new fabric.Canvas("canvas", {
        width: window.innerHeight,
        height: window.innerHeight,
        backgroundColor: "#CED4DA",
        setZoom: 0.3,
        selection: false,
      }));

    const newCanvas = initCanvas();
    newCanvas.on("mouse:wheel", opt => {
      const delta = opt.e.deltaY;
      let Zoom = canvasRef.current.getZoom();

      Zoom *= 0.999 ** delta;
      Zoom = Zoom > 20 ? 20 : Zoom < 0.01 && 0.01;

      if (Zoom > 20) Zoom = 20;
      if (Zoom < 0.01) Zoom = 0.01;

      canvasRef.current.zoomToPoint(
        { x: opt.e.offsetX, y: opt.e.offsetY },
        Zoom,
      );

      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    canvasRef.current = newCanvas;

    const resizeCanvas = () => {
      canvasRef.current.setHeight(window.innerHeight - 90);
      canvasRef.current.setWidth(window.innerWidth - 290);

      canvasRef.current.calcOffset();
      canvasRef.current.renderAll();
    };

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (canvasRef.current) {
        canvasRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (frameList.length > 0) {
      const firstFrame = frameList[0];

      setFrameId(firstFrame.id);
      setFrameName(firstFrame.name);
    }
  }, [frameList]);

  useEffect(() => {
    if (!diffingResult) {
      return;
    }

    if (diffingResult.result === "error") {
      setToast({ status: true, message: diffingResult.message });

      return;
    }

    const frames = [];

    for (const frameId in diffingResult.content.frames) {
      const frame = diffingResult.content.frames[frameId];

      setFrameList(frames);

      frames.push({ name: frame.name, id: frameId });
    }
  }, [diffingResult]);

  useEffect(() => {
    if (!(diffingResult && frameId)) {
      const renderFabricOnCanvas = async content => {
        await renderFabricFrame(content.frames[frameId]);
        renderFabricDifference(content.differences);
      };

      if (canvasRef.current) {
        canvasRef.current.remove(...canvasRef.current.getObjects());
      }
      renderFabricOnCanvas(diffingResult.content);
      canvasRef.current.renderAll();
      return;
    }
  }, [frameId]);

  return (
    <>
      {isLoading && (
        <Modal>
          <Loading />
        </Modal>
      )}
      {isClickedNewVersion && (
        <Modal>
          <TextWrapper>
            <h1 className="re-version-title">새 버전을 비교하시겠어요?</h1>
            <Description
              className="re-version-description"
              size="medium"
              text="버튼을 누르면 현재 화면에서 벗어나게 됩니다.\n보고계신 정보는 저장되지 않아요."
            />
          </TextWrapper>
          <ButtonWrapper>
            <Button
              className="close-button"
              size="medium"
              usingCase="line"
              handleClick={ev => {
                ev.preventDefault();
                setIsClickedNewVersion(false);
              }}
            >
              아니오
            </Button>
            <Button
              className="re-version"
              size="medium"
              usingCase="solid"
              handleClick={ev => {
                ev.preventDefault();

                navigate("/version");
              }}
            >
              비교할래요!
            </Button>
          </ButtonWrapper>
        </Modal>
      )}
      <ResultWrapper>
        <header className="result-header">
          <div className="logo-content">
            <Link to="/">
              <img className="logo" src={figciLogo} alt="figci-logo-img" />
            </Link>
          </div>
          <div className="header-information">
            <div className="version-information">
              <div className="versions">
                <p className="label">Before</p>
                <p className="version">{beforeVersionLabel}</p>
              </div>
              <div className="versions">
                <p className="label">After</p>
                <p className="version">{afterVersionLabel}</p>
              </div>
              <Button
                className="reselect-version"
                size="small"
                usingCase="line"
                handleClick={ev => {
                  ev.preventDefault();

                  setIsClickedNewVersion(true);
                }}
              >
                버전 재선택
              </Button>
            </div>
            <div className="profile">
              <div className="line" />
              <div className="profile-image"></div>
              <p className="username"></p>
            </div>
          </div>
        </header>
        <div className="content">
          <Sidebar
            framesInfo={frameList}
            projectUrl={projectUrl}
            onFrameSelect={handleFrameClick}
            selectedFrameId={frameId}
            selectedFrameName={frameName}
          />
          <canvas id="canvas" ref={canvasRef} />
        </div>
      </ResultWrapper>
      {toast.status && (
        <ToastPopup setToast={setToast} message={toast.message} />
      )}
    </>
  );
}

const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .result-header {
    display: flex;
    justify-content: space-between;
  }

  .header-information {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 24px 32px;
    border-bottom: 2px solid #000000;
  }

  .version-information {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
  }

  .versions {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    margin-right: 24px;
  }

  .content {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
  }

  .profile {
    display: flex;
    align-items: center;
  }

  .profile-image {
    width: 40px;
    height: 40px;
    border-radius: 48px;
    border: 2px solid #000000;
    margin-left: 40px;
    margin-right: 12px;

    background-color: #ffffff;
  }

  .label {
    margin-right: 12px;

    color: #000000;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
  }

  .version {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 12px;

    color: #495057;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    text-align: left;
  }

  .username {
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    text-align: left;
  }

  .logo-content {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 300px;
    min-width: 290px;
    padding: 24px 40px;
    border-right: 2px solid #000000;
    border-bottom: 2px solid #000000;
  }

  .logo {
    width: 70px;
    margin-right: 21px;
  }

  .line {
    width: 2px;
    height: 20px;

    background-color: #000000;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TextWrapper = styled.div`
  margin-bottom: 48px;
  width: 500px;

  .re-version-title {
    margin-bottom: 28px;

    color: #000000;
    font-size: 1.75rem;
    font-weight: 900;
    font-style: normal;
    line-height: 32px;
    text-align: center;
  }

  .re-version-content {
    display: block;

    color: #495057;
    font-size: 1rem;
    font-weight: 500;
    font-style: normal;
    text-align: center;
    line-height: 24px;
  }
`;

export default DiffingResult;
