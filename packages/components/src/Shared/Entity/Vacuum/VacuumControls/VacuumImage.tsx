import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import DEFAULT_IMAGE from "./vacuum.png";

const cleaning = keyframes`
  0% {
    transform: rotate(0) translate(0);
  }
  5% {
    transform: rotate(0) translate(0, -10px);
  }
  10% {
    transform: rotate(0) translate(0, 5px);
  }
  15% {
    transform: rotate(0) translate(0);
  }
  /* Turn left */
  20% {
    transform: rotate(30deg) translate(0);
  }
  25% {
    transform: rotate(30deg) translate(0, -10px);
  }
  30% {
    transform: rotate(30deg) translate(0, 5px);
  }
  35% {
    transform: rotate(30deg) translate(0);
  }
  40% {
    transform: rotate(0) translate(0);
  }
  /* Turn right */
  45% {
    transform: rotate(-30deg) translate(0);
  }
  50% {
    transform: rotate(-30deg) translate(0, -10px);
  }
  55% {
    transform: rotate(-30deg) translate(0, 5px);
  }
  60% {
    transform: rotate(-30deg) translate(0);
  }
  70% {
    transform: rotate(0deg) translate(0);
  }
  /* Staying still */
  100% {
    transform: rotate(0deg);
  }
`;

const returning = keyframes`
  0% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(10deg);
  }
  50% {
    transform: rotate(0);
  }
  75% {
    transform: rotate(-10deg);
  }
  100% {
    transform: rotate(0);
  }
`;

export const StyledVacuumImage = styled.img`
  width: 80%;
  image-rendering: crisp-edges;
  cursor: pointer;
  filter: brightness(0.9);
  transition: opacity var(--ha-transition-duration) var(--ha-easing);

  &.on,
  &.cleaning,
  &.mowing,
  &.edgecut,
  &.auto,
  &.spot,
  &.edge,
  &.single_room {
    animation: ${cleaning} 5s linear infinite;
  }
  &.returning {
    animation: ${returning} 2s linear infinite;
  }
  &.paused {
    opacity: 100%;
  }
  &.docked {
    opacity: 0.5;
  }
`;


// React component that applies default props
export const VacuumImage = ({ src = DEFAULT_IMAGE, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
  return <StyledVacuumImage src={src} {...props} />;
};
