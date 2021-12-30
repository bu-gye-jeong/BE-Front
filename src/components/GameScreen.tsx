import { nanoid } from "@reduxjs/toolkit";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Element } from "./Element";

const MainScreen = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.color.bg};
`;

interface IElement {
  elementId: number;
  id: string;
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
  const [draggingElement, setDragging] = useState<number | undefined>(
    undefined
  );
  const [maxZIndex, setMaxZIndex] = useState(0);
  const targetRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  const mousedownHandler = useCallback(
    (index: number) => () => {
      setMaxZIndex((state) => state + 1);
      setDragging(index);
    },
    []
  );
  const elementRefs = useRef<Array<HTMLDivElement | null>>([]);

  const testOverlap = (elementIndex: number): number | undefined => {
    const rect1 = elementRefs.current[elementIndex]?.getBoundingClientRect();
    if (!rect1) return;
    const sortedRefs = [...elementRefs.current].sort((a, b) =>
      a?.style?.zIndex
        ? b?.style?.zIndex
          ? +b.style.zIndex - +a.style.zIndex
          : -1
        : 1
    );

    for (let i = 1; i < elementRefs.current.length; i++) {
      const v = sortedRefs[i];
      if (!v) continue;
      const rect2 = v.getBoundingClientRect();
      if (
        rect1.top <= rect2.bottom &&
        rect1.bottom >= rect2.top &&
        rect1.left <= rect2.right &&
        rect1.right >= rect2.left
      )
        return elementRefs.current.indexOf(v);
    }
  };

  useEffect(() => {
    const merge = (ele1index: number, ele2index: number, toCreate: number) => {
      const newElements = (elements: IElement[]) =>
        elements
          .filter((_, i) => i !== ele2index)
          .map((v, i) => (i === ele1index ? { ...v, elementId: toCreate } : v));
      setElements(newElements);
    };

    const mouseleaveHandler = () => setDragging(undefined);
    const mouseupHandler = (ev: MouseEvent) => {
      setDragging(undefined);
      if (ev.target instanceof HTMLElement && ev.target.dataset.index) {
        const index = parseInt(ev.target.dataset.index);
        if (isNaN(index)) return;
        const overlapIndex = testOverlap(index);
        if (typeof overlapIndex === "undefined") return;
        else merge(index, overlapIndex, 0);
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
    elementRefs.current = elementRefs.current.slice(0, elements.length);
  }, [elements]);

  return (
    <MainScreen ref={targetRef}>
      {elements.map((v, i) => (
        <Element
          key={v.id}
          index={i}
          elementId={v.elementId}
          isDragging={draggingElement === i}
          onMouseDown={mousedownHandler(i)}
          screenRef={targetRef}
          ref={(el) => {
            elementRefs.current[i] = el;
          }}
          zIndex={draggingElement === i ? maxZIndex + 1 : undefined}
        />
      ))}
    </MainScreen>
  );
};
