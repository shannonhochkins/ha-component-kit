import styled from "@emotion/styled";
import { FabCard } from "@components";

export const Fab = styled(FabCard)`
  background-color: var(--ha-S600);

  &:not(.active) {
    color: black;
  }
  opacity: 0.8;
  transition: opacity var(--ha-transition-duration) var(--ha-easing);
  &:disabled {
    opacity: 0.38;
  }
  &:not(:disabled) {
    &:hover,
    &:active {
      opacity: 1;
      color: black;
    }
  }
  z-index: 2;
`;
