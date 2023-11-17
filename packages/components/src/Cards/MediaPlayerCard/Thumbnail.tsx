import styled from "@emotion/styled";

export const Thumbnail = styled.div<{
  backgroundImage?: string;
  size: string;
}>`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 0.5rem;
  background-size: cover;
  background-repeat: no-repeat;
  ${(props) => props.backgroundImage && `background-image: url('${props.backgroundImage}');`}
`;
