import styled from "@emotion/styled";
import { Icon } from "@iconify/react";
import { css } from "@emotion/react";
import { Row, fallback, mq, PreloadImage, type PreloadImageProps } from "@components";
import { motion } from "framer-motion";
import type { MotionProps } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";

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
  /** an object containing the props to pass to the preloader */
  preloadProps?: PreloadImageProps;
}

const StyledPictureCard = styled(motion.button)<Partial<PictureCardProps>>`
  outline: none;
  border: 0;
  padding: 0;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  width: 100%;
  display: flex;
  aspect-ratio: 16 / 9;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  cursor: pointer;
  background-color: var(--ha-S300);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: background-color, box-shadow, background-image;
  will-change: width, height;
  flex-shrink: 1;
  &:hover {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    background-color: var(--ha-S400);
  }
  ${mq(
    ["mobile"],
    `
    width: 100%;
  `,
  )}
  ${mq(
    ["tablet", "smallScreen"],
    `
    width: calc(((100% - 1 * var(--gap, 0rem)) / 2));
  `,
  )}
  ${mq(
    ["desktop", "mediumScreen"],
    `
    width: calc(((100% - 2 * var(--gap, 0rem)) / 3));
  `,
  )}
  ${mq(
    ["largeDesktop"],
    `
    width: calc(((100% - 4 * var(--gap, 0rem)) / 4));
  `,
  )}
`;

const PictureCardFooter = styled(motion.h4)`
  all: unset;
  padding: 1rem;
  color: var(--ha-500-contrast);
  background-color: var(--ha-background-opaque);
  position: absolute;
  inset: auto 0 0 0;
  font-weight: bold;
  font-size: 1.2rem;
`;

function _PictureCard({
  onClick,
  title,
  image,
  icon,
  className,
  cssStyles,
  preloadProps,
  ...rest
}: PictureCardProps): JSX.Element {
  return (
    <StyledPictureCard
      className={`picture-card ${className ?? ""}`}
      css={css`
        ${cssStyles ?? ""}
      `}
      {...rest}
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        if (typeof onClick === "function") onClick();
      }}
    >
      <PreloadImage
      {...preloadProps ?? {}}
      src={image}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
      }}
      onClick={() => {
        if (typeof onClick === "function") onClick();
      }}
      lazy
      >
        <PictureCardFooter className="footer">
          <Row gap={"0.5rem"} className="row">
            {icon && <Icon icon={icon} className="icon" />}
            {title}
          </Row>
        </PictureCardFooter>
      </PreloadImage>
    </StyledPictureCard>
  );
}
/** A simple component to render an image with a title/icon similar to the lovelace picture card, you can also bind a click event to the card */
export function PictureCard(props: PictureCardProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "PictureCard" })}>
      <_PictureCard {...props} />
    </ErrorBoundary>
  );
}
