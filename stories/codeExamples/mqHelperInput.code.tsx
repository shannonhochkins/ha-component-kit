import { getColumnSizeCSS, mq } from '@hakit/components';
import styled from '@emotion/styled';

export const SomeCard = styled.div`
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  width: ${getColumnSizeCSS(6)};
  ${mq(
    ["xxs", "xs"],
    `
    width: ${getColumnSizeCSS(12)};
  `,
  )}
`;
  