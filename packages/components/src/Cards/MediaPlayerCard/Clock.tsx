import styled from "@emotion/styled";

export const Clock = styled.div<{
  entity: string;
}>`
  position: absolute;
  bottom: 0.5rem;
  left: 0;
  opacity: 0;
  transition: opacity var(--ha-transition-duration) var(--ha-easing);
  padding: 0.2rem;
  font-size: 0.8rem;
  background: var(--ha-S200);
  z-index: 1;
  border-radius: 0.25rem;
  pointer-events: none;
  transform: translateX(-50%);
  ${(props) => {
    return `
      &:before {
        content: var(--progress-${props.entity}-clock, '');
      }
    `;
  }}
`;
