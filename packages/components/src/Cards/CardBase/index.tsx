import { motion, type MotionProps, type HTMLMotionProps, type ForwardRefComponent } from "framer-motion";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { useLongPress, type LongPressReactEvents } from "use-long-press";
import { lowerCase, startCase } from "lodash";
import { memo, useMemo, useId, useState, useCallback, type ReactNode, type ElementType, CSSProperties } from "react";
import {
  type EntityName,
  type DomainService,
  type ExtractDomain,
  type ServiceData,
  type HassEntityWithService,
  computeDomain,
  isUnavailableState,
  useEntity,
} from "@hakit/core";
import { CSSInterpolation } from "@emotion/serialize";
import {
  ModalByEntityDomain,
  Ripples,
  fallback,
  type RipplesProps,
  type AvailableQueries,
  type ModalPropsHelper,
  type BreakPoint,
} from "@components";
import { ErrorBoundary } from "react-error-boundary";

const getMotionElement = (as: ElementType, onlyFunctionality?: boolean) => {
  // dodgey hack to get typescript to play nicely here
  // @ts-expect-error - not possible to get the correct types as framer-motion doesn't export them
  const MotionElement = motion[as] as ForwardRefComponent<HTMLElement, HTMLMotionProps<"div">>;
  if (!MotionElement) {
    throw new Error(`Failed to create a motion component for element type: ${as}`);
  }
  if (onlyFunctionality) {
    return styled(MotionElement)``;
  }
  return styled(MotionElement)<{
    disableActiveState: boolean;
  }>`
    outline: none;
    border: 0;
    box-sizing: border-box;
    padding: 0;
    position: relative;
    overflow: hidden;
    display: flex;
    width: 100%;
    cursor: pointer;
    background-color: var(--ha-S300);
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
    transform: scale(1) translate3d(0, 0, 0);
    transition: var(--ha-transition-duration) var(--ha-easing);
    transition-property: background-color, background-image;
    color: var(--ha-S200-contrast);
    flex-shrink: 1;
    user-select: none;
    svg {
      color: var(--ha-S200-contrast);
      transition: color var(--ha-transition-duration) var(--ha-easing);
    }
    &:not(:disabled):hover,
    &:not(.disabled):hover {
      background-color: var(--ha-S300);
      color: var(--ha-500-contrast);
      svg {
        color: var(--ha-S300-contrast);
      }
    }
    &:disabled,
    &.disabled {
      cursor: not-allowed;
      opacity: 0.8;
    }
    ${(props) =>
      !props.disableActiveState &&
      `
      &.active, &:active {
        background-color: var(--ha-A400);
        color: var(--ha-900-contrast);
        svg {
          color: var(--ha-900-contrast);
        }
        &:not(:disabled):hover, &:not(.disabled):hover {
          background-color: var(--ha-A700);
          color: var(--ha-900-contrast);
        }
      }
    `}
  `;
};

const StyledRipples = styled(Ripples)`
  flex-shrink: 1;
  width: 100%;
  height: 100%;
`;

const Trigger = styled(motion.div)`
  width: 100%;
  height: 100%;
`;

type Extendable<T extends ElementType> = Omit<
  React.ComponentPropsWithRef<T> & MotionProps,
  "onClick" | "disabled" | "title" | "children" | "active"
>;

export type CardBaseProps<T extends ElementType = "div", E extends EntityName = EntityName> = Extendable<T> &
  AvailableQueries & {
    /** convert the component type to something else @default "div" */
    as?: T;
    /** children to render alongside the card */
    children?: ReactNode;
    /** should the card be disabled, this will disable any click events, service calls and scale effects */
    disabled?: boolean;
    /** Optional active param, By default this is updated via home assistant  @default undefined */
    active?: boolean;
    /** By default, the title is retrieved from the domain name, or you can specify a manual title @default undefined */
    title?: ReactNode;
    /** The name of your entity */
    entity?: E;
    /** The service name, eg "toggle, turnOn ..." */
    service?: DomainService<ExtractDomain<E>>;
    /** The data to pass to the service */
    serviceData?: ServiceData<ExtractDomain<E>, DomainService<ExtractDomain<E>>>;
    /** callback to fire after a long press event */
    longPressCallback?: E extends undefined
      ? (entity: null, event: LongPressReactEvents) => void
      : (entity: HassEntityWithService<ExtractDomain<E>>, event: LongPressReactEvents) => void;
    /** The onClick handler is called when the card is pressed, the first argument will be entity object with api methods if entity is provided  */
    /** The onClick handler is called when the button is pressed, the first argument will be entity object with api methods if entity is provided  */
    onClick?: E extends undefined
      ? (entity: null, event: React.MouseEvent<HTMLElement>) => void
      : (entity: HassEntityWithService<ExtractDomain<E>>, event: React.MouseEvent<HTMLElement>) => void;
    /** props to pass to the modal */
    modalProps?: Partial<ModalPropsHelper<ExtractDomain<E>>>;
    /** include ripples or not */
    disableRipples?: boolean;
    /** disable the scale effect on the card when clicked */
    disableScale?: boolean;
    /** disable the styles of the card when in the active state */
    disableActiveState?: boolean;
    /** This also controls the animated modal border-radius, update the border radius of the card @default "1rem" */
    borderRadius?: CSSProperties["borderRadius"];
    /** completely disable the automated column sizes, this will default to whatever width is provided by the user or the card @default false */
    disableColumns?: boolean;
    /** props to pass to the ripple component if enabled */
    rippleProps?: Omit<RipplesProps, "children">;
    /**
     *
     * A css string to update the card, this is similar to how you'd write scss.
     *
     * ```jsx
     * export const MyComponent = (otherProps) => {
     *   return <SomeCard cssStyles={`
     *     color: var(--ha-900-contrast);
     *    .some-selector {
     *        &:hover {
     *            background-color: var(--ha-A400);
     *        }
     *    }
     * `} {...otherProps} />
     * }
     * ```
     */
    cssStyles?: CSSInterpolation;
    /** a reference to the top level element, we can't use the "ref" prop because of the use of generics, so "elRef" it is */
    elRef?: React.Ref<HTMLElement>;
    /** remove all base styles of the card and just use the inbuilt functionality */
    onlyFunctionality?: boolean;
  };

const DEFAULT_SIZES: Required<AvailableQueries> = {
  xxs: 12,
  xs: 12,
  sm: 12,
  md: 12,
  lg: 12,
  xlg: 12,
};

const _CardBase = function _CardBase<T extends ElementType, E extends EntityName>({
  as = "div" as T,
  entity: _entity,
  title: _title,
  active,
  service,
  serviceData,
  children,
  disabled,
  longPressCallback,
  onClick,
  modalProps,
  disableRipples = false,
  disableScale = false,
  disableActiveState = false,
  onlyFunctionality = false,
  id,
  className,
  cssStyles,
  style,
  borderRadius = "1rem",
  rippleProps,
  disableColumns,
  whileTap,
  layoutId,
  elRef,
  ...rest
}: CardBaseProps<T, E>) {
  const _id = useId();
  const [openModal, setOpenModal] = useState(false);
  const domain = _entity ? computeDomain(_entity) : null;
  const entity = useEntity(_entity ?? "unknown", {
    returnNullIfNotFound: true,
  });
  const isUnavailable = useMemo(() => (typeof entity?.state === "string" ? isUnavailableState(entity.state) : false), [entity?.state]);
  const _borderRadius = borderRadius;
  const StyledElement = useMemo(() => getMotionElement(as, onlyFunctionality), [as, onlyFunctionality]);
  const bind = useLongPress(
    (e) => {
      if (typeof longPressCallback === "function") {
        if (entity !== null) {
          // we don't know the types at this level, but they will be correct at the parent level
          longPressCallback(entity as never, e);
        } else {
          longPressCallback(null as never, e);
        }
      }
      if (typeof _entity === "string" && !openModal) {
        setOpenModal(true);
      }
    },
    {
      threshold: 300,
      cancelOnMovement: true,
      cancelOutsideElement: true,
      filterEvents(e) {
        return !("button" in e && e.button === 2);
      },
    },
  );
  const onClickHandler = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      // so we can expect it to throw errors however the parent level ts validation will catch invalid params.
      if (typeof service === "string" && entity && !isUnavailable) {
        // @ts-expect-error - we don't actually know the service at this level
        const caller = entity.service[service];
        caller(serviceData);
      }
      if (typeof onClick === "function") {
        if (entity !== null) {
          // we don't know the types at this level, but they will be correct at the parent level
          onClick(entity as never, event);
        } else {
          onClick(null as never, event);
        }
      }
    },
    [service, disabled, entity, serviceData, onClick, isUnavailable],
  );
  // use the input title if provided, else use the domain if available, else null
  const title = useMemo(
    () => _title || entity?.attributes?.friendly_name || (domain !== null ? startCase(lowerCase(domain)) : null),
    [_title, entity, domain],
  );

  const columnClassNames = useMemo(() => {
    const mergedGrids = Object.entries(DEFAULT_SIZES).reduce<Required<AvailableQueries>>((acc, [key, value]) => {
      const inputValue = rest[key as BreakPoint];
      return {
        ...acc,
        [key]: inputValue ?? value,
      };
    }, DEFAULT_SIZES);
    return Object.entries(mergedGrids)
      .map(([key, value]) => `${key}-${value}`)
      .join(" ");
    // this is okay, we only want this effect to re-run when the breakpoints change not the entire prop object
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rest.xxs, rest.xs, rest.sm, rest.md, rest.lg, rest.xlg]);

  return (
    <>
      <StyledElement
        ref={elRef}
        id={id ?? ""}
        className={`card-base ${className ?? ""} ${disableColumns ? "" : columnClassNames} ${active ? "active " : ""} ${
          isUnavailable ? "unavailable" : ""
        } ${disabled ? "disabled" : ""} `}
        css={css`
          ${cssStyles ?? ""}
        `}
        style={{
          ...(style ?? {}),
          borderRadius: _borderRadius,
        }}
        whileTap={whileTap ?? { scale: disableScale || disabled || isUnavailable ? 1 : 0.9 }}
        {...(typeof _entity === "string" ? bind() : {})}
        onClick={onClickHandler}
        layoutId={layoutId ?? _id}
        disableActiveState={disableActiveState}
        {...rest}
      >
        {disableRipples ? (
          <Trigger className="contents" onClick={onClickHandler}>
            {children}
          </Trigger>
        ) : (
          <StyledRipples {...rippleProps} borderRadius={_borderRadius} disabled={disabled || isUnavailable}>
            <Trigger className="contents" onClick={onClickHandler}>
              {children}
            </Trigger>
          </StyledRipples>
        )}
      </StyledElement>
      {typeof _entity === "string" && (
        <ModalByEntityDomain
          entity={_entity as EntityName}
          title={title ?? "Unknown title"}
          onClose={() => {
            setOpenModal(false);
          }}
          open={openModal}
          id={_id}
          {...modalProps}
        />
      )}
    </>
  );
};

/**
 * This is the base care component that every other card component should extend, it comes with everything we need to be able to replicate functionality
 * like the modal popup, ripples and more.
 * */
export const CardBase = memo(function CardBase<T extends ElementType, E extends EntityName>(props: CardBaseProps<T, E>) {
  return (
    <ErrorBoundary {...fallback({ prefix: "CardBase" })}>
      <_CardBase {...props} />
    </ErrorBoundary>
  );
});
