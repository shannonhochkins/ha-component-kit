import styled from '@emotion/styled';

export const SomeCard = styled.div`
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  width: calc( (100% - 11 * var(--gap, 0px)) * 6 / 12 + (6 - 1) * var(--gap, 0px) );
  .bp-xxs & {
    width: calc( (100% - 11 * var(--gap, 0px)) * 12 / 12 + (12 - 1) * var(--gap, 0px) );
  }
  .bp-xs & {
    width: calc( (100% - 11 * var(--gap, 0px)) * 12 / 12 + (12 - 1) * var(--gap, 0px) );
  }
`;
  