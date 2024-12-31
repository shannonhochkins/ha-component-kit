import { motion, type MotionProps, type HTMLMotionProps, type ForwardRefComponent } from "framer-motion";
import { css } from "@emotion/react";
import { useLongPress, type LongPressReactEvents } from "use-long-press";
import { lowerCase, startCase } from "lodash";
import {
  memo,
  useMemo,
  useId,
  useState,
  useCallback,
  Children,
  isValidElement,
  cloneElement,
  type ReactElement,
  type ReactNode,
  type ElementType,
  CSSProperties,
  useRef,
} from "react";
import {
  type EntityName,
  type DomainService,
  type ExtractDomain,
  type ServiceData,
  type HassEntityWithService,
  type HistoryOptions,
  computeDomain,
  isUnavailableState,
  useEntity,
  useHass,
  localize,
} from "@hakit/core";
import { CSSInterpolation } from "@emotion/serialize";
import {
  ModalByEntityDomain,
  Ripples,
  fallback,
  type RipplesProps,
  type AvailableQueries,
  type ModalByEntityDomainProps,
  type BreakPoint,
  Alert,
  SvgGraph,
  ButtonBar,
  ButtonBarProps,
  SvgGraphProps,
  type RelatedEntity,
  type RelatedEntityProps,
} from "@components";
import { type FeatureEntity, type FeatureEntityProps } from "./FeatureEntity";
import { ErrorBoundary } from "react-error-boundary";
import { isValidProp } from "../../utils/isValidProp";
import styled from "@emotion/styled";
import { useResizeDetector } from "react-resize-detector";
import { useResizeDetectorProps } from "react-resize-detector";
import { SVG_HEIGHT, SVG_WIDTH } from "../../Shared/SvgGraph/constants";

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
  return styled(MotionElement, {
    shouldForwardProp: (prop) => isValidProp(prop),
  })<{
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
    .graph-element {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }
    &:not(.disabled):not(:disabled):not(:focus):hover {
      background-color: var(--ha-S400);
      color: var(--ha-500-contrast);
      svg {
        color: var(--ha-S400-contrast);
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
        &:not(:disabled):not(.disabled):hover {
          background-color: var(--ha-A700);
          color: var(--ha-900-contrast);
        }
      }
    `}
  `;
};

const StyledRipples = styled((props: RipplesProps) => <Ripples {...props} />)`
  flex-shrink: 1;
  width: 100%;
  height: 100%;
`;

const Trigger = styled.div`
  width: 100%;
  height: 100%;
  &:has(.features) {
    display: flex;
    flex-direction: column;
  }
  > .features {
    padding: 0 1rem 1rem;
    > .fit-content > .button-group-inner > * {
      width: auto;
      flex-grow: 1;
      > .button-bar-button {
        width: auto;
        flex-grow: 1;
      }
    }
  }
`;

type Extendable<T extends ElementType> = Omit<
  React.ComponentPropsWithRef<T> & MotionProps,
  "onClick" | "disabled" | "title" | "children" | "active"
>;

// Define the allowed children types
type AllowedFeaturedEntity = ReactElement<typeof FeatureEntity> | false | null | undefined;
type AllowedFeaturedEntities = AllowedFeaturedEntity | AllowedFeaturedEntity[];

// Define the allowed children types
type AllowedRelatedEntity = ReactElement<typeof RelatedEntity> | false | null | undefined;
type AllowedRelatedEntities = AllowedRelatedEntity | AllowedRelatedEntity[];

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
    /** The service name to call */
    service?: DomainService<ExtractDomain<E>>;
    /** The data to pass to the service */
    serviceData?: ServiceData<ExtractDomain<E>, DomainService<ExtractDomain<E>>>;
    /** allows you to place a fully functional and interactive element at predefined zones of the card, like displaying an icon in the top left which might be a sensor indicating battery level */
    relatedEntities?: AllowedRelatedEntities;
    /** provide a FeatureEntity component as a list or individual components to render a bar at the bottom of the card */
    features?: AllowedFeaturedEntities;
    /** props to pass to the feature bar */
    featureBarProps?: Omit<ButtonBarProps, "children">;
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
    modalProps?: Partial<ModalByEntityDomainProps<E>>;
    /** include ripples or not */
    disableRipples?: boolean;
    /** disable the scale effect on the card when clicked */
    disableScale?: boolean;
    /** disable the styles of the card when in the active state */
    disableActiveState?: boolean;
    /** This also controls the animated modal border-radius, update the border radius of the card @default "16px" */
    borderRadius?: CSSProperties["borderRadius"];
    /** completely disable the automated column sizes, this will default to whatever width is provided by the user or the card @default false */
    disableColumns?: boolean;
    /** props to pass to the ripple component if enabled */
    rippleProps?: Omit<RipplesProps, "children">;
    /** className to provide to the trigger element */
    triggerClass?: string;
    /** the graph settings containing the entity to display a graph in the background of the card */
    graph?: {
      /** the entity to display the graph for */
      entity: EntityName;
      /** the props to pass to the svg graph, control the styles and colors of the graph from here */
      props?: SvgGraphProps;
      /** the space at the bottom of the card is automatically calculated by the available height, you can adjust this by manipulating the value here @default 0px */
      adjustGraphSpaceBy?: CSSProperties["paddingBottom"];
      /** options to pass to the history request */
      historyOptions?: HistoryOptions;
    };
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
    /** a reference to the top level element, we can't use the "ref" prop because of the use of generics, so "elRef" it is, this answer here describes the reasoning behind this decision @see https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref */
    elRef?: React.Ref<HTMLElement>;
    /** remove all base styles of the card and just use the inbuilt functionality */
    onlyFunctionality?: boolean;
    /** props to pass to the resize detector, this is useful if you want to trigger something whenever the card resizes */
    resizeDetectorProps?: useResizeDetectorProps<HTMLElement>;
  };

const DEFAULT_SIZES: Required<AvailableQueries> = {
  xxs: 12,
  xs: 6,
  sm: 6,
  md: 4,
  lg: 4,
  xlg: 3,
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
  borderRadius = "16px",
  rippleProps,
  disableColumns,
  whileTap,
  layoutId,
  elRef,
  key,
  relatedEntities,
  features,
  featureBarProps,
  graph,
  resizeDetectorProps,
  triggerClass,
  ...rest
}: CardBaseProps<T, E>) {
  const _id = useId();
  const { useStore } = useHass();
  const globalComponentStyle = useStore((state) => state.globalComponentStyles);
  const [openModal, setOpenModal] = useState(false);
  const domain = _entity ? computeDomain(_entity) : null;
  const entity = useEntity(_entity ?? "unknown", {
    returnNullIfNotFound: true,
  });
  const internalRef = useRef<HTMLElement | null>(null);
  // useful so users can subscribe to the resize event
  const { width = 0 } = useResizeDetector({
    refreshMode: "debounce",
    refreshRate: 50,
    handleHeight: false,
    skipOnMount: false,
    targetRef: (elRef as React.MutableRefObject<HTMLElement>) ?? internalRef,
    ...(resizeDetectorProps ?? {}),
  });
  const graphEntity = useEntity(graph?.entity ?? "unknown", {
    returnNullIfNotFound: true,
    historyOptions: {
      disable: false,
      ...graph?.historyOptions,
    },
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

  const filteredRelatedEntities = Children.toArray(relatedEntities).filter((child): child is ReactElement => isValidElement(child));
  const filteredFeaturedEntities = Children.toArray(features).filter((child): child is ReactElement => isValidElement(child));

  const featuredElements = Children.map(filteredFeaturedEntities, (child, index) => {
    if (isValidElement<FeatureEntityProps<EntityName>>(child)) {
      return cloneElement(child, {
        key: child.key || `${_id}${index}`,
        ...child.props,
      });
    }
    return child;
  });
  const hasFeatures = filteredFeaturedEntities.length > 0;
  const featureBar = hasFeatures && (
    <ButtonBar layoutType="bubble" className="features" fullWidth gap="0.5rem" {...featureBarProps}>
      {featuredElements}
    </ButtonBar>
  );

  function calculateSvgHeight(parentWidth: number): CSSProperties["paddingBottom"] {
    const aspectRatio = SVG_WIDTH / SVG_HEIGHT;
    return `calc(${parentWidth / aspectRatio}px - ${graph?.adjustGraphSpaceBy ?? "0px"});`;
  }

  const svgHeight = calculateSvgHeight(width);

  const _classes = useMemo(() => {
    return [
      "card-base",
      className ?? "",
      disableColumns ? "" : columnClassNames,
      active ? "active" : "",
      isUnavailable ? "unavailable" : "",
      disabled || isUnavailable ? "disabled" : "",
      hasFeatures ? "has-features" : "",
      graphEntity ? "has-graph" : "",
    ]
      .filter((x) => !!x)
      .join(" ");
  }, [active, className, columnClassNames, disableColumns, disabled, graphEntity, hasFeatures, isUnavailable]);

  return (
    <>
      <StyledElement
        key={key}
        ref={elRef ?? internalRef}
        id={id ?? ""}
        className={_classes}
        css={css`
          padding-bottom: ${graphEntity ? svgHeight : "inherit"};
          ${globalComponentStyle.cardBase ?? ""}
          ${cssStyles ?? ""}
        `}
        style={{
          ...(style ?? {}),
          borderRadius: _borderRadius,
        }}
        whileTap={whileTap ?? { scale: disableScale || disabled || isUnavailable ? 1 : 0.9 }}
        layoutId={layoutId ?? _id}
        disableActiveState={disableActiveState}
        disabled={isUnavailable || disabled}
        {...bind()}
        {...rest}
      >
        {graphEntity && (
          <div className={"graph-element history"}>
            {graphEntity.history.loading ? (
              <Alert className={"loading"} description={localize("loading")} />
            ) : graphEntity.history.coordinates.length > 0 ? (
              <SvgGraph coordinates={graphEntity.history.coordinates} {...graph?.props} />
            ) : (
              <Alert className={"no-state-history"} description={localize("no_state_history_found")} />
            )}
          </div>
        )}
        {disableRipples ? (
          <Trigger className={`contents trigger-element ${triggerClass}`} onClick={onClickHandler}>
            {children}
            {featureBar}
          </Trigger>
        ) : (
          <StyledRipples {...rippleProps} key={rippleProps?.key} borderRadius={_borderRadius} disabled={disabled || isUnavailable}>
            <Trigger className={`contents trigger-element ${triggerClass}`} onClick={onClickHandler}>
              {children}
              {featureBar}
            </Trigger>
          </StyledRipples>
        )}
        {Children.map(filteredRelatedEntities, (child, index) => {
          if (isValidElement<RelatedEntityProps<EntityName>>(child)) {
            return cloneElement(child, {
              key: child.key || `${_id}${index}`,
              ...child.props,
            });
          }
          return child;
        })}
      </StyledElement>
      {typeof _entity === "string" && (
        <ModalByEntityDomain
          {...modalProps}
          entity={_entity as EntityName}
          title={modalProps?.title ?? title ?? localize("unknown")}
          onClose={() => {
            setOpenModal(false);
            if (modalProps?.onClose) {
              modalProps.onClose();
            }
          }}
          open={modalProps?.open || openModal}
          id={_id}
        />
      )}
    </>
  );
};

/**
 * This is the base card component that every other card component should extend, it comes with everything we need to be able to replicate functionality
 * like the modal popup, ripples and more.
 *
 * You can use this if you want an empty shell of a component that you can build on top of.
 * */
export const CardBase = memo(function CardBase<T extends ElementType, E extends EntityName>(props: CardBaseProps<T, E>) {
  return (
    <ErrorBoundary {...fallback({ prefix: "CardBase" })}>
      <_CardBase {...props} />
    </ErrorBoundary>
  );
});
