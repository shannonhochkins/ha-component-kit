import styled from "@emotion/styled";

export const ProgressBar = styled.div<{
  entity: string;
  disabled?: boolean;
}>`
  ${(props) => `
  position: absolute;
  bottom: 0;
  left: 0;
  padding-top: 0.5rem;
  border-radius: 0.25rem;
  overflow: hidden;
  width: 100%;
  z-index: 1;
  cursor: pointer;
  span {
    background: rgba(255,255,255,0.2);
    height: 0.3rem;
    position: relative;
    width: 100%;
    display: block;
    &:before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--ha-300);
      width: var(--progress-${props.entity}-width, 100%);
    }
  }
  &.disabled {
    cursor: not-allowed;
    span {
      &:before {
        background: rgba(255,255,255,0.2);
      }
    }
  }
  &:hover:not(.disabled) + .clock {
    opacity: 1;
  }
  `}
`;
