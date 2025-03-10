import React, { useCallback } from "react";
import styled, { keyframes } from "styled-components";

const DEFAULT_COLOR = "#4fa94d";
const DEFAULT_WAI_ARIA_ATTRIBUTE = {
  "aria-busy": true,
  role: "status",
};
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

const POINTS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Svg = styled.svg`
  animation: ${spin} 0.75s steps(12, end) infinite;
  animation-duration: 0.75s;
`;

const Polyline = styled.polyline`
  stroke-width: ${(props) => props.width}px;
  stroke-linecap: round;
  &:nth-child(12n + 0) {
    stroke-opacity: 0.08;
  }
  &:nth-child(12n + 1) {
    stroke-opacity: 0.17;
  }
  &:nth-child(12n + 2) {
    stroke-opacity: 0.25;
  }
  &:nth-child(12n + 3) {
    stroke-opacity: 0.33;
  }
  &:nth-child(12n + 4) {
    stroke-opacity: 0.42;
  }
  &:nth-child(12n + 5) {
    stroke-opacity: 0.5;
  }
  &:nth-child(12n + 6) {
    stroke-opacity: 0.58;
  }
  &:nth-child(12n + 7) {
    stroke-opacity: 0.66;
  }
  &:nth-child(12n + 8) {
    stroke-opacity: 0.75;
  }
  &:nth-child(12n + 9) {
    stroke-opacity: 0.83;
  }
  &:nth-child(12n + 11) {
    stroke-opacity: 0.92;
  }
`;

export const RotatingLines = ({
  strokeColor = DEFAULT_COLOR,
  strokeWidth = "5",
  animationDuration = "0.75",
  width = "96",
  visible = true,
  ariaLabel = "rotating-lines-loading",
}) => {
  const lines = useCallback(
    () =>
      POINTS.map((point) => (
        <Polyline
          key={point}
          points="24,12 24,4"
          width={strokeWidth}
          transform={`rotate(${point}, 24, 24)`}
        />
      )),
    [strokeWidth]
  );

  return !visible ? null : (
    <Svg
      xmlns={SVG_NAMESPACE}
      viewBox="0 0 48 48"
      width={width}
      stroke={strokeColor}
      speed={animationDuration}
      data-testid="rotating-lines-svg"
      aria-label={ariaLabel}
      {...DEFAULT_WAI_ARIA_ATTRIBUTE}
    >
      {lines()}
    </Svg>
  );
};
