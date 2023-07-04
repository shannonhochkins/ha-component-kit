import styled from "@emotion/styled";
import { StyledButtonCard } from "@components/Buttons/ButtonCard";

const GroupInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  ${StyledButtonCard} {
    margin: 0;
  }
`;

const StyledGroup = styled.div`
  h3 {
    color: var(--ha-primary-color);
  }
`;

export interface GroupProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}
/** The group component will automatically layout the children in a row with a predefined gap between the children. */
export function Group({ title, children, ...rest }: GroupProps) {
  return (
    <StyledGroup {...rest}>
      <h3>{title}</h3>
      <GroupInner>{children}</GroupInner>
    </StyledGroup>
  );
}
