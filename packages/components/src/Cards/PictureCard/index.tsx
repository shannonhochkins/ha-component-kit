import styled from "@emotion/styled";
import { Icon, type IconProps } from "@iconify/react";
import { Row, fallback, PreloadImage, CardBase, type CardBaseProps, type PreloadImageProps, type AvailableQueries } from "@components";
import { ErrorBoundary } from "react-error-boundary";
import { EntityName } from "@hakit/core";

type OmitProperties =
  | "title"
  | "as"
  | "active"
  | "entity"
  | "disabled"
  | "service"
  | "serviceData"
  | "onClick"
  | "active"
  | "longPressCallback"
  | "modalProps";

export interface PictureCardProps extends Omit<CardBaseProps<"button">, OmitProperties> {
  /** an image to provide to the card */
  image: string;
  /** a title of the card */
  title: string;
  /** an optional icon to provide */
  icon?: string;
  /** the props for the icon, which includes styles for the icon */
  iconProps?: Omit<IconProps, "icon">;
  /** an object containing the props to pass to the preloader */
  preloadProps?: PreloadImageProps;
  /** called when the card is pressed */
  onClick?: () => void;
}

const StyledPictureCard = styled(CardBase as React.ComponentType<CardBaseProps<"button", EntityName>>)`
  aspect-ratio: 16 / 9;
`;
const Inner = styled.div`
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
`;

const PictureCardFooter = styled.h4`
  all: unset;
  font-family: var(--ha-font-family);
  padding: 1rem;
  color: var(--ha-500-contrast);
  background-color: var(--ha-background-opaque);
  position: absolute;
  inset: auto 0 0 0;
  font-weight: bold;
  font-size: 1.2rem;
`;

function _PictureCard({
  title,
  key,
  image,
  icon,
  iconProps,
  className,
  preloadProps,
  children,
  ...rest
}: PictureCardProps): React.ReactNode {
  return (
    <StyledPictureCard
      key={key}
      disableActiveState
      disableScale={rest.disableScale ?? typeof rest.onClick === "undefined"}
      disableRipples={rest.disableRipples ?? typeof rest.onClick === "undefined"}
      className={`picture-card ${className ?? ""}`}
      {...rest}
    >
      <Inner>
        <PreloadImage
          {...(preloadProps ?? {})}
          src={image}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
          lazy
        >
          <PictureCardFooter className="footer">
            <Row gap={"0.5rem"} className="row">
              {icon && <Icon icon={icon} className="icon" {...(iconProps ?? {})} />}
              {title}
            </Row>
          </PictureCardFooter>
        </PreloadImage>
      </Inner>
      {children && <div className="children">{children}</div>}
    </StyledPictureCard>
  );
}
/** A simple component to render an image with a title/icon similar to the lovelace picture card, you can also bind a click event to the card, which will also return the entity if provided
 * @example
 * <PictureCard entity="group.some_group_of_lights" onClick={(entity) => {
 *  entity.service.toggle();
 * }}
 */
export function PictureCard(props: PictureCardProps) {
  const defaultColumns: AvailableQueries = {
    xxs: 12,
    xs: 6,
    sm: 6,
    md: 4,
    lg: 4,
    xlg: 3,
  };
  return (
    <ErrorBoundary {...fallback({ prefix: "PictureCard" })}>
      <_PictureCard {...defaultColumns} {...props} />
    </ErrorBoundary>
  );
}
