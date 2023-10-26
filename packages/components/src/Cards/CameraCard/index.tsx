import type {
  EntityName,
  FilterByDomain,
  CameraEntityExtended,
} from "@hakit/core";
import {
  useCamera,
  isUnavailableState,
  STREAM_TYPE_WEB_RTC,
  STREAM_TYPE_HLS,
} from "@hakit/core";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { motion, type MotionProps } from "framer-motion";
import { useEffect, useCallback, useRef, useState, useMemo } from "react";
import {
  PreloadImage,
  fallback,
  Row,
  mq,
  FabCard,
  ButtonGroup,
  ButtonGroupProps,
} from "@components";
import { ErrorBoundary } from "react-error-boundary";
import { CameraStream } from "./stream";
import { type VideoState } from "./players";
import { Icon } from "@iconify/react";

type Extendable = Omit<React.ComponentProps<"div">, "onClick" | "ref"> &
  MotionProps;
export interface CameraCardProps extends Extendable {
  /** The name of your camera entity */
  entity: FilterByDomain<EntityName, "camera">;
  /** override the camera name displayed in the card */
  name?: string;
  /** hide the camera name @default false */
  hideName?: boolean;
  /** the view to display the camera in, poster is an image that updated based on the
   * specified interval, live is a live stream if supported and motion is a motion jpeg
   * (automatically selected if live stream not supported) @default 'poster' */
  view?: "poster" | "live" | "motion";
  /** auto play the video stream */
  autoPlay?: boolean;
  /** mute the video player  @default true */
  muted?: boolean;
  /** enable / disable the controls for the player @default false */
  controls?: boolean;
  /** tells the video player to play inline @default true */
  playsInline?: boolean;
  /** the refresh rate for the poster image when in poster view @default 10000 */
  posterUpdateInterval?: number;
  /** sensors to render in the header of the card */
  headerSensors?: ButtonGroupProps["buttons"];
  /** hide the footer of the card, this will hide all sensors @default false */
  hideFooter?: boolean;
  /** hide the view controls @default false */
  hideViewControls?: boolean;
  /** fired when the card is clicked, this will provide the camera with all extended data */
  onClick?: (
    camera: CameraEntityExtended,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
}

const Header = styled(Row)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
  z-index: 1;
`;

const StateFabCard = styled(FabCard)`
  box-shadow: 0px 2px 4px rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  .icon {
    background-color: ${(props) =>
      props.active ? `rgba(255,255,255,0.8)` : `rgba(255,255,255,0.5)`};

    color: ${(props) =>
      props.active ? `rgba(0, 0, 0, 1)` : `rgba(0, 0, 0, 0.4)`};
    &:not(:disabled):hover {
      background-color: ${(props) =>
        props.active ? `rgba(255,255,255,0.8)` : `rgba(255,255,255,0.5)`};
    }
  }
`;

const Wrapper = styled(motion.div)`
  padding: 0;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  width: 100%;
  aspect-ratio: 16/9;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  cursor: pointer;
  background-color: var(--ha-S300);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: box-shadow, background-color;
  &.disabled {
    cursor: not-allowed;
    opacity: 0.8;
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
    width: calc(((100% - 3 * var(--gap, 0rem)) / 4));
  `,
  )}
`;

const CameraName = styled.div`
  color: var(--ha-500-contrast);
  background-color: hsla(var(--ha-h), calc(var(--ha-s) * 1%), 10%, 0.6);
  padding: 0.5rem;
  border-radius: 0.4rem;
`;

const Footer = styled(Row)`
  padding: 0.5rem;
  color: var(--ha-500-contrast);
  background-color: hsla(var(--ha-h), calc(var(--ha-s) * 1%), 10%, 0.6);
  transition: color var(--ha-transition-duration) var(--ha-easing);
  position: absolute;
  inset: auto 0 0 0;
  font-weight: bold;
  font-size: 1.2rem;
  z-index: 1;
`;

const StyledIcon = styled(Icon)`
  opacity: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
`;

const DEFAULT_ICON_BUTTON_SIZE = 30;

function _CameraCard({
  entity,
  view = "poster",
  autoPlay = true,
  muted = true,
  controls = false,
  playsInline = true,
  posterUpdateInterval = 10000,
  id,
  className,
  cssStyles,
  name,
  hideName,
  headerSensors,
  hideFooter,
  hideViewControls,
  onClick,
  ...rest
}: CameraCardProps) {
  const cameraUpdater = useRef<number | undefined>(undefined);
  const loadingIconRef = useRef<SVGSVGElement | null>(null);
  const stateValueRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [_view, setView] = useState(view);
  const camera = useCamera(entity, {
    // stream loading handled internally on the stream component
    stream: false,
    poster: _view === "poster",
  });
  const { poster, mjpeg } = camera;
  const isUnavailable = isUnavailableState(camera.state);

  const supportsLiveStream =
    camera.attributes.frontend_stream_type === STREAM_TYPE_HLS ||
    camera.attributes.frontend_stream_type === STREAM_TYPE_WEB_RTC;

  const _stopUpdateCameraInterval = (): void => {
    if (cameraUpdater.current) {
      clearInterval(cameraUpdater.current);
      cameraUpdater.current = undefined;
    }
  };

  const _startUpdateCameraInterval = useCallback((): void => {
    _stopUpdateCameraInterval();
    cameraUpdater.current = window.setInterval(
      () => poster.refresh(),
      posterUpdateInterval,
    );
  }, [poster, posterUpdateInterval]);

  useEffect(() => {
    return () => {
      _stopUpdateCameraInterval();
    };
  }, []);

  useEffect(() => {
    if (view === "poster") {
      _startUpdateCameraInterval();
    }
  }, [view, _startUpdateCameraInterval]);

  useEffect(() => {
    if (view) {
      setView(view);
    }
  }, [view]);

  const onImageLoad = useCallback(() => {
    setLoading(false);
  }, []);

  const onImageLoading = useCallback(() => {
    setLoading(true);
  }, []);

  const onVideoStateChange = useCallback((state: VideoState) => {
    if (stateValueRef.current !== null) {
      if (state === "canplay" || state === "canplaythrough") {
        stateValueRef.current.innerText = "ready";
      } else if (state === "play" || state === "playing") {
        stateValueRef.current.innerText = "playing";
      } else {
        stateValueRef.current.innerText = state;
      }
    }
    if (loadingIconRef.current) {
      loadingIconRef.current.style.opacity =
        state === "waiting" || state === "stalled" ? "1" : "0";
    }
  }, []);

  const _headerSensors = useMemo(
    () =>
      headerSensors?.map((sensor) => ({
        size: DEFAULT_ICON_BUTTON_SIZE,
        disabled: isUnavailable,
        ...sensor,
      })),
    [headerSensors, isUnavailable],
  );

  const viewButtons = useMemo(() => {
    const buttons: ButtonGroupProps["buttons"] = [];
    if (supportsLiveStream) {
      buttons.push({
        icon: "mdi:video",
        size: DEFAULT_ICON_BUTTON_SIZE,
        disabled: isUnavailable,
        onClick: () => {
          setView("live");
        },
        active: _view === "live",
        title: "Live View",
        tooltipPlacement: "top",
      });
    }
    buttons.push(
      ...([
        {
          icon: "mdi:video-image",
          size: DEFAULT_ICON_BUTTON_SIZE,
          disabled: isUnavailable,
          onClick: () => {
            setView("motion");
          },
          active: _view === "motion",
          title: "Motion View",
          tooltipPlacement: "top",
        },
        {
          onClick: () => {
            setView("poster");
          },
          disabled: isUnavailable,
          size: DEFAULT_ICON_BUTTON_SIZE,
          icon: "el:picture",
          active: _view === "poster",
          title: "Poster View",
          tooltipPlacement: "top",
        },
      ] satisfies ButtonGroupProps["buttons"]),
    );
    return buttons;
  }, [supportsLiveStream, isUnavailable, _view]);

  return (
    <Wrapper
      id={id ?? ""}
      cssStyles={css`
        ${cssStyles ?? ""}
      `}
      className={`camera-card ${className ?? ""}`}
      onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        if (onClick) onClick(camera, event);
      }}
      {...rest}
    >
      <Header justifyContent="space-between" gap="0.5rem">
        <Row justifyContent="flex-start" gap="0.5rem">
          <StateFabCard
            active
            borderRadius={10}
            disableScaleEffect
            size={30}
            noIcon
          >
            <div ref={stateValueRef}>
              {loading
                ? "CONNECTING"
                : _view === "live"
                ? "loading"
                : camera.state}
            </div>
          </StateFabCard>
        </Row>
        {isUnavailable && (
          <CameraName>Unavailable {camera.entity_id}</CameraName>
        )}
        {!hideName && (
          <CameraName>
            {name ?? camera.attributes.friendly_name ?? camera.entity_id}
          </CameraName>
        )}
      </Header>
      {!hideFooter && (
        <Footer justifyContent="space-between" gap="0.5rem" wrap="nowrap">
          {_headerSensors && (
            <Row justifyContent="flex-start" gap="0.5rem">
              <ButtonGroup
                cssStyles={`
          button {
            height: ${DEFAULT_ICON_BUTTON_SIZE}px !important;
          }
        `}
                buttons={_headerSensors}
              />
            </Row>
          )}
          {!hideViewControls && (
            <Row justifyContent="flex-start" gap="0.5rem">
              <ButtonGroup
                cssStyles={`
          button {
            height: ${DEFAULT_ICON_BUTTON_SIZE}px !important;
          }
        `}
                buttons={viewButtons}
              />
            </Row>
          )}
        </Footer>
      )}
      {_view !== "live" && (poster.url || mjpeg.url) && (
        <PreloadImage
          onLoad={onImageLoad}
          onLoading={onImageLoading}
          src={_view === "motion" && mjpeg.url ? mjpeg.url : poster.url ?? ""}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
          lazy
        />
      )}
      {_view === "live" && (
        <>
          <StyledIcon
            ref={loadingIconRef}
            icon="eos-icons:three-dots-loading"
          />
          <CameraStream
            autoPlay={autoPlay}
            muted={muted}
            controls={controls}
            playsInline={playsInline}
            onStateChange={onVideoStateChange}
            entity={entity}
          />
        </>
      )}
    </Wrapper>
  );
}

/**
 * The CameraCard is a card to display a live stream, poster image that refreshes at a specified interval or a motion jpeg stream.
 *
 * By Default, it will load a poster image and refresh it at a specified interval, if you want to use the live stream you can set the view to live or motion.
 *
 * This supports HLS, WebRTC and MJPEG streams, the WebRTC implementation hasn't been tested so if you're using WebRTC and it's not working for you please create an [issue request](https://github.com/shannonhochkins/ha-component-kit/issues).
 *
 * It also supports additional entities to render on the card such is motion detection, vehicle detection if you have entities that have additional data you can display them in the card easily.
 *
 * This is one of the first components that i have NOT got a complete demo working, as you can imagine setting up a live stream, motion image and refreshable poster image is a difficult and time expensive task, so you'll have to try it out to explore it's wonders :)
 *
 * Note: If you want to just use the stream, you can also import CameraStream from @hakit/components to use the stream as a video player element.
 * */
export function CameraCard(props: CameraCardProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "CameraCard" })}>
      <_CameraCard {...props} />
    </ErrorBoundary>
  );
}
