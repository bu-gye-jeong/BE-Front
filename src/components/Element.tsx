import React, { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { mergeTransitionDuration } from "../constants";
import waterImg from "../resources/water.png";
import fireImg from "../resources/fire.png";
import { convertUnit } from "../utils/convert";
import { IMergedElement, IMergingElement } from "./GameScreen";

const ElementWrapper = styled.div<{
  isHovering: boolean;
  mergingData: IMergingElement | undefined;
  mergedData: IMergedElement | undefined;
  elementId: number;
}>`
  --elementSize: 10vmin;
  position: absolute;
  width: var(--elementSize);
  height: var(--elementSize);
  background-color: ${({ theme }) => theme.color.eleBg};
  border-radius: 1vmin;
  padding: 0;

  background-image: url("${({ elementId }) =>
    elementId === 0 ? waterImg : fireImg}");

  background-repeat: no-repeat;
  background-size: var(--elementSize);
  image-rendering: pixelated;
  image-rendering: crisp-edges;

  box-shadow: 0 0 10px ${({ theme }) => theme.color.eleShadow};

  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    box-shadow 0.3s cubic-bezier(0.23, 1, 0.32, 1), background-image 0.2s linear;

  :hover {
    transform: scale(1.1);
    cursor: pointer;
    box-shadow: 0 0 15px ${({ theme }) => theme.color.eleShadow};
  }

  :active {
    transform: scale(1.2);
    box-shadow: 0 0 20px ${({ theme }) => theme.color.eleShadow};
  }

  ${({ mergingData }) => {
    return mergingData
      ? `transform: scale(1.3) !important; 
  transition: transform ${mergeTransitionDuration}s
    cubic-bezier(0.075, 0.82, 0.165, 1);`
      : null;
  }}
  ${({ mergedData }) => {
    return mergedData
      ? `transform: scale(0.3) !important; 
  top: ${mergedData.targetPos.y}vh !important;
  left: ${mergedData.targetPos.x}vw !important;
  transition: transform ${mergeTransitionDuration}s
  cubic-bezier(.72,-1.24,.33,-0.04), 
    top ${mergeTransitionDuration}s cubic-bezier(.32,-3.29,.85,.59),
    left ${mergeTransitionDuration}s cubic-bezier(.32,-3.29,.85,.59);`
      : null;
  }}
  ${({ isHovering, theme }) => {
    return isHovering
      ? `transform: scale(1.1); 
      box-shadow: 0 0 15px ${theme.color.eleShadow};`
      : null;
  }};
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
  isHovering: boolean;
  mergedData: IMergedElement | undefined;
  mergingData: IMergingElement | undefined;
  onMouseDown: React.MouseEventHandler<HTMLDivElement> | undefined;
  screenRef: React.MutableRefObject<HTMLDivElement>;
  zIndex?: number;
  id: string;
}

export const Element = React.forwardRef<HTMLDivElement, ElementProps>(
  (props, ref) => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [prevZIndex, setPrevZIndex] = useState(0);
    const targetRef =
      useRef<HTMLDivElement | null>() as React.MutableRefObject<HTMLDivElement | null>;

    const handleMouseMove = useCallback(
      (ev: MouseEvent) => {
        if (props.mergingData || props.mergedData) return;
        setPos((state) => ({
          x: convertUnit(
            Math.min(
              Math.max(convertUnit(state.x, "vw", "px") + ev.movementX, 0),
              props.screenRef.current.offsetWidth -
                (targetRef?.current?.offsetWidth ?? 0)
            ),
            "px",
            "vw"
          ),
          y: convertUnit(
            Math.min(
              Math.max(convertUnit(state.y, "vh", "px") + ev.movementY, 0),
              props.screenRef.current.offsetHeight -
                (targetRef?.current?.offsetHeight ?? 0)
            ),
            "px",
            "vh"
          ),
        }));
      },
      [props.mergingData, props.mergedData, props.screenRef]
    );

    useEffect(() => {
      if (props.isDragging) {
        window.addEventListener("mousemove", handleMouseMove);
      } else {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    }, [props.isDragging, handleMouseMove]);

    useEffect(() => {
      if (!props.zIndex) return;
      setPrevZIndex(props.zIndex);
    }, [props.zIndex]);

    return (
      <ElementWrapper
        elementId={props.elementId}
        style={{
          left: pos.x + "vw",
          top: pos.y + "vh",
          zIndex: props.zIndex ?? prevZIndex,
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
        isHovering={props.isHovering}
        mergingData={props.mergingData}
        mergedData={props.mergedData}
        onMouseDown={props.onMouseDown}
        data-id={props.id}>
        <ElementName data-id={props.id}>
          {props.elementId === 0 ? "WATER DROP" : "FIRE"}
        </ElementName>
      </ElementWrapper>
    );
  }
);
