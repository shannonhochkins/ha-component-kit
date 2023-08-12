import styled from "@emotion/styled";
import { Icon } from "@iconify/react";
import { Row } from "@components";
import { motion } from "framer-motion";
import type { MotionProps } from "framer-motion";

type Extendable = Omit<React.ComponentProps<"button">, "onClick" | "ref"> &
  MotionProps;
export interface PictureCardProps extends Extendable {
  onClick?: () => void;
  /** an image to provide to the picture card */
  image: string;
  /** a title of the picture card */
  title: string;
  /** an optional icon to provide */
  icon?: string;
}

export const StyledPictureCard = styled(motion.button)<
  Partial<PictureCardProps>
>`
  all: unset;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  width: var(--ha-device-picture-card-width);
  display: flex;
  aspect-ratio: 16 / 9;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  cursor: pointer;
  background-color: var(--ha-primary-background);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: background-color, box-shadow, background-image;
  will-change: width, height;

  ${(props) =>
    props.image &&
    `
    background-image: url(${props.image});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  `}

  &:hover {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    background-color: var(--ha-primary-background-hover);
  }
`;

const PictureCardFooter = styled(motion.h4)`
  all: unset;
  padding: 1rem;
  background-color: var(--ha-background-opaque);
  position: absolute;
  inset: auto 0 0 0;
  font-weight: bold;
  font-size: 1.2rem;
`;

/** A simple component to render an image with a title/icon similar to the lovelace picture card, you can also bind a click event to the card */
export function PictureCard({
  onClick,
  title,
  image,
  icon,
  ...rest
}: PictureCardProps): JSX.Element {
  return (
    <StyledPictureCard
      {...rest}
      whileTap={{ scale: 0.9 }}
      image={image}
      onClick={() => {
        if (typeof onClick === "function") onClick();
      }}
    >
      <PictureCardFooter>
        <Row gap={"0.5rem"}>
          {icon && <Icon icon={icon} />}
          {title}
        </Row>
      </PictureCardFooter>
    </StyledPictureCard>
  );
}
