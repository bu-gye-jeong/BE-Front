import React, { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import waterImg from "../resources/water.png";
import { convertUnit } from "../utils/convert";

const ElementWrapper = styled.div`
  --elementSize: 10vmin;
  position: absolute;
  width: var(--elementSize);
  height: var(--elementSize);
  background-color: ${({ theme }) => theme.color.eleBg};
  border-radius: 1vmin;
  padding: 0;

  background-image: url("${waterImg}");
  background-repeat: no-repeat;
  background-size: var(--elementSize);
  image-rendering: pixelated;
  image-rendering: crisp-edges;

  box-shadow: 0 0 10px ${({ theme }) => theme.color.eleShadow};

  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    box-shadow 0.3s cubic-bezier(0.23, 1, 0.32, 1);

  :hover {
    transform: scale(1.1);
    box-shadow: 0 0 15px ${({ theme }) => theme.color.eleShadow};
  }

  :active {
    transform: scale(1.2);
    box-shadow: 0 0 20px ${({ theme }) => theme.color.eleShadow};
  }
`;

const ElementName = styled.div`
  position: absolute;
  color: white;
  bottom: -1.2em;

  font-family: "Azeret Mono", monospace;
  font-weight: 700;
  font-size: 1.2em;
  width: 100%;
  text-align: center;
`;

interface ElementProps {
  elementId: number;
  isDragging: boolean;
  onMouseDown: React.MouseEventHandler<HTMLDivElement> | undefined;
  screenRef: React.MutableRefObject<HTMLDivElement>;
  zIndex?: number;
  index: number;
}

export const Element = React.forwardRef<HTMLDivElement, ElementProps>(
  ({ elementId, isDragging, onMouseDown, screenRef, zIndex, index }, ref) => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [prevZIndex, setPrevZIndex] = useState(0);
    const targetRef =
      useRef<HTMLDivElement | null>() as React.MutableRefObject<HTMLDivElement | null>;

    const handleMouseMove = useCallback(
      (ev: MouseEvent) => {
        setPos((state) => ({
          x: convertUnit(
            Math.min(
              Math.max(convertUnit(state.x, "vw", "px") + ev.movementX, 0),
              screenRef.current.offsetWidth -
                (targetRef?.current?.offsetWidth ?? 0)
            ),
            "px",
            "vw"
          ),
          y: convertUnit(
            Math.min(
              Math.max(convertUnit(state.y, "vh", "px") + ev.movementY, 0),
              screenRef.current.offsetHeight -
                (targetRef?.current?.offsetHeight ?? 0)
            ),
            "px",
            "vh"
          ),
        }));
      },
      [screenRef]
    );

    useEffect(() => {
      if (isDragging) {
        window.addEventListener("mousemove", handleMouseMove);
      } else {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    }, [isDragging, handleMouseMove]);

    useEffect(() => {
      if (!zIndex) return;
      setPrevZIndex(zIndex);
    }, [zIndex]);

    return (
      <ElementWrapper
        style={{
          left: pos.x + "vw",
          top: pos.y + "vh",
          zIndex: zIndex ?? prevZIndex,
        }}
        ref={(node) => {
          targetRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current =
              node;
          }
        }}
        onMouseDown={onMouseDown}
        data-index={index}>
        <ElementName>WATER DROP</ElementName>
      </ElementWrapper>
    );
  }
);
