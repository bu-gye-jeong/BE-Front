import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useForceUpdate } from "../hooks/forceUpdate";
import useWindowDimensions from "../hooks/windowDimensions";
import { Element } from "./Element";

const MainScreen = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.color.bg};
`;

export const GameScreen = () => {
  const { width, height } = useWindowDimensions();
  const forceUpdate = useForceUpdate();
  const targetsRef = useRef<Array<HTMLDivElement | null>>(
    []
  ) as React.MutableRefObject<Array<HTMLDivElement | null>>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [elements, setElements] = useState(new Array(5).fill(0));
  const [draggingElement, setDragging] = useState<undefined | number>();
  const elementsPos = useRef<{
    [index: number]: { x: number; y: number };
  }>({ 0: { x: 0, y: 0 } });

  useEffect(() => {
    const mouseupHandler = () => setDragging(undefined);
    document.addEventListener("mouseup", mouseupHandler);
    return () => {
      document.removeEventListener("mouseup", mouseupHandler);
    };
  }, []);

  useEffect(() => {
    targetsRef.current = targetsRef.current.slice(0, elements.length);
  }, [elements]);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (typeof draggingElement === "undefined") return;
    elementsPos.current[draggingElement] = {
      x: Math.min(
        Math.max(elementsPos.current[draggingElement].x + e.movementX, 0),
        width - (targetsRef.current[draggingElement]?.offsetWidth ?? 0)
      ),
      y: Math.min(
        Math.max(elementsPos.current[draggingElement].y + e.movementY, 0),
        height - (targetsRef.current[draggingElement]?.offsetHeight ?? 0)
      ),
    };
    forceUpdate();
  };

  return (
    <MainScreen onMouseMove={handleMouseMove}>
      {elements.map((v, i) => (
        <Element
          key={i}
          ref={(el) => (targetsRef.current[i] = el)}
          style={(() => {
            if (elementsPos.current[i]) {
              return {
                left: elementsPos.current[i].x,
                top: elementsPos.current[i].y,
              };
            } else {
              elementsPos.current[i] = { x: 0, y: 0 };
              return { left: 0, top: 0 };
            }
          })()}
          elementId={v}
          isDragging={draggingElement === i}
          onMouseDown={() => setDragging(i)}
        />
      ))}
    </MainScreen>
  );
};
