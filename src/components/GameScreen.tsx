import { nanoid } from "@reduxjs/toolkit";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { mergeTransitionDuration } from "../constants";
import { convertUnit } from "../utils/convert";
import { Element } from "./Element";

const MainScreen = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  flex-grow: 1;
  background-color: ${({ theme }) => theme.color.bg};
`;

interface IElement {
  elementId: number;
  id: string;
}

export interface IMergingElement {
  id: string;
  targetPos: { x: number; y: number };
}

export interface IMergedElement {
  id: string;
  targetPos: { x: number; y: number };
}

const createNewElement = (elementId: number): IElement => ({
  elementId,
  id: nanoid(),
});

export const GameScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [elements, setElements] = useState<IElement[]>(
    Array.from({ length: 20 }, () => createNewElement(0))
  );
  const [draggingElement, setDragging] = useState<string | undefined>(
    undefined
  );
  const [hoveringElement, setHovering] = useState<string | undefined>(
    undefined
  );
  const [mergingElements, setMerging] = useState<IMergingElement[]>([]);
  const [mergedElements, setMerged] = useState<IMergedElement[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(0);
  const targetRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  const mousedownHandler = useCallback(
    (id: string) => () => {
      if (
        mergingElements.find((v) => v.id === id) ||
        mergedElements.find((v) => v.id === id)
      )
        return;
      setMaxZIndex((state) => state + 1);
      setDragging(id);
    },
    [mergedElements, mergingElements]
  );
  const elementRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});

  const testOverlap = (id: string): string | undefined => {
    const rect1 = elementRefs.current[id]?.getBoundingClientRect();
    if (!rect1) return;
    const sortedRefs = [...Object.entries(elementRefs.current)].sort((a, b) =>
      a[1]?.style?.zIndex
        ? b[1]?.style?.zIndex
          ? +b[1].style.zIndex - +a[1].style.zIndex
          : -1
        : 1
    );

    for (let i = 1; i < sortedRefs.length; i++) {
      const v = sortedRefs[i][1];
      if (!v) continue;
      const rect2 = v.getBoundingClientRect();
      if (
        rect1.top <= rect2.bottom &&
        rect1.bottom >= rect2.top &&
        rect1.left <= rect2.right &&
        rect1.right >= rect2.left
      )
        return Object.keys(elementRefs.current).find(
          (key) => elementRefs.current[key] === v
        );
    }
  };

  useEffect(() => {
    const merge = (ele1id: string, ele2id: string, toCreate: number) => {
      const mergingRect = elementRefs.current[ele1id]?.getBoundingClientRect();
      const mergedRect = elementRefs.current[ele2id]?.getBoundingClientRect();
      if (!mergingRect || !mergedRect) return;
      const screenRect = targetRef.current.getBoundingClientRect();
      const mergingPos = {
        x: convertUnit(mergingRect.x - screenRect.x, "px", "vw"),
        y: convertUnit(mergingRect.y - screenRect.y, "px", "vh"),
      };
      const mergedPos = {
        x: convertUnit(mergedRect.x - screenRect.x, "px", "vw"),
        y: convertUnit(mergedRect.y - screenRect.y, "px", "vh"),
      };

      setMerging((state) => [...state, { id: ele1id, targetPos: mergedPos }]);
      setMerged((state) => [...state, { id: ele2id, targetPos: mergingPos }]);

      setTimeout(() => {
        setElements((elements) =>
          elements.map((v, i) =>
            v.id === ele1id ? { ...v, elementId: toCreate } : v
          )
        );
        setMerging((state) => state.filter((v, _) => v.id !== ele1id));
        setMerged((state) => state.filter((v, _) => v.id !== ele2id));
        setElements((elements) => elements.filter((v, _) => v.id !== ele2id));
      }, mergeTransitionDuration * 1000);
    };

    const mouseleaveHandler = () => setDragging(undefined);
    const mouseupHandler = (ev: MouseEvent) => {
      setDragging(undefined);
      setHovering(undefined);
      if (ev.target instanceof HTMLElement && ev.target.dataset.id) {
        const id = ev.target.dataset.id;
        if (!id) return;
        const overlapId = testOverlap(id);
        if (typeof overlapId === "undefined") return;
        else merge(id, overlapId, 1);
      }
    };

    const { current } = targetRef;
    current.addEventListener("mouseup", mouseupHandler);
    current.addEventListener("mouseleave", mouseleaveHandler);
    return () => {
      current.removeEventListener("mouseup", mouseupHandler);
      current.removeEventListener("mouseleave", mouseleaveHandler);
    };
  }, []);

  useEffect(() => {
    const mousemoveHandler = () => {
      if (typeof draggingElement === "undefined") return;
      const overlapIndex = testOverlap(draggingElement);
      setHovering(overlapIndex);
    };

    const { current } = targetRef;
    current.addEventListener("mousemove", mousemoveHandler);
    return () => {
      current.removeEventListener("mousemove", mousemoveHandler);
    };
  }, [draggingElement]);

  useEffect(() => {
    const elementIds = elements.map((v) => v.id);
    elementRefs.current = Object.fromEntries(
      Object.entries(elementRefs.current).filter((v) =>
        elementIds.includes(v[0])
      )
    );
  }, [elements]);

  return (
    <MainScreen ref={targetRef}>
      {elements.map((v, i) => (
        <Element
          key={v.id}
          id={v.id}
          elementId={v.elementId}
          isDragging={draggingElement === v.id}
          isHovering={hoveringElement === v.id}
          mergingData={mergingElements.find((ele) => v.id === ele.id)}
          mergedData={mergedElements.find((ele) => v.id === ele.id)}
          onMouseDown={mousedownHandler(v.id)}
          screenRef={targetRef}
          ref={(el) => {
            elementRefs.current[v.id] = el;
          }}
          zIndex={draggingElement === v.id ? maxZIndex + 1 : undefined}
        />
      ))}
    </MainScreen>
  );
};
