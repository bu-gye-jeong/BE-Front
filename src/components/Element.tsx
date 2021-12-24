import React from "react";
import styled from "styled-components";
import waterImg from "../resources/water.png";

const ElementWrapper = styled.div`
  --elementSize: 6em;
  position: absolute;
  width: var(--elementSize);
  height: var(--elementSize);
  background-color: ${({ theme }) => theme.color.eleBg};
  border-radius: 0.7em;

  background-image: url("${waterImg}");
  background-repeat: no-repeat;
  background-size: var(--elementSize);
  image-rendering: pixelated;
  image-rendering: crisp-edges;

  box-shadow: 0 0 10px ${({ theme }) => theme.color.eleShadow};
`;

interface ElementProps {
  elementId: number;
  isDragging: boolean;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement> | undefined;
  style?: React.CSSProperties | undefined;
}

export const Element = React.forwardRef<HTMLDivElement, ElementProps>(
  (props, ref) => {
    return (
      <ElementWrapper
        ref={ref}
        style={props.style}
        onMouseDown={props.onMouseDown}
      />
    );
  }
);
