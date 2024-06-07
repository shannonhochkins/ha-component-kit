import { memo, useMemo, type ReactNode } from "react";
import { useRef } from "react";
import { HassProvider } from "./Provider";
import type { HassProviderProps } from "./Provider";
import { motion, AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

export type HassConnectProps = {
  /** Any react node to render when authenticated */
  children: ReactNode;
  /** The url to your home assistant instance, can be local, nabucasa or any hosted url with home-assistant.  */
  hassUrl: string;
  /** if you provide a hassToken you will bypass the login screen altogether - @see https://developers.home-assistant.io/docs/auth_api/#long-lived-access-token */
  hassToken?: string;
  /** Any react node to render when not authenticated or loading */
  loading?: ReactNode;
  /** called once the entity subscription is successful, and only once */
  onReady?: () => void;
  /** options for the provider */
  options?: Omit<HassProviderProps, "children" | "hassUrl">;
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const blip = keyframes`
  0% {stroke-width:0; opacity:0;}
  50% {stroke-width:5; opacity:1;}
  100% {stroke-width:0; opacity:0;}
`;

function LoaderBase({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg>
        <path d="m 12.5,20 15,0 0,0 -15,0 z" />
        <path d="m 32.5,20 15,0 0,0 -15,0 z" />
        <path d="m 52.5,20 15,0 0,0 -15,0 z" />
        <path d="m 72.5,20 15,0 0,0 -15,0 z" />
      </svg>
    </div>
  );
}

const Loader = styled(LoaderBase)`
  position: fixed;
  inset: 0;
  background-color: #1a1a1a;
  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6.25em;
    height: 3.125em;
    margin: -1.562em 0 0 -3.125em;
    path {
      fill: none;
      stroke: #f0c039;
      opacity: 0;
    }
    path:nth-of-type(1) {
      animation: ${blip} 1s ease-in-out 0s infinite alternate;
    }
    path:nth-of-type(2) {
      animation: ${blip} 1s ease-in-out 0.1s infinite alternate;
    }
    path:nth-of-type(3) {
      animation: ${blip} 1s ease-in-out 0.2s infinite alternate;
    }
    path:nth-of-type(4) {
      animation: ${blip} 1s ease-in-out 0.3s infinite alternate;
    }
  }
`;

const MotionDiv = styled(motion.div)`
  width: 100%;
  height: 100%;
`;

/** This component will show the Home Assistant login form you're used to seeing normally when logging into HA, once logged in you shouldn't see this again unless you clear device storage, once authenticated it will render the child components of HassConnect and provide access to the api. */
export const HassConnect = memo(function HassConnect({
  children,
  hassUrl,
  hassToken,
  loading = <Loader />,
  onReady,
  options = {},
}: HassConnectProps): ReactNode {
  const onReadyCalled = useRef(false);

  const sanitizedUrl = useMemo(() => {
    try {
      // htftp://lofcalhost:1234/ => origin of "null" so we need to account for malformed urls
      // @see https://github.com/shannonhochkins/ha-component-kit/issues/146#issuecomment-2138352567
      return new URL(hassUrl).origin;
    } catch (e) {
      return null;
    }
  }, [hassUrl]);

  if (!sanitizedUrl || sanitizedUrl === "null" || sanitizedUrl === null) {
    return <>{`Provide the hassUrl prop with a valid url to your home assistant instance.`}</>;
  }

  return (
    <HassProvider hassUrl={sanitizedUrl} hassToken={hassToken} {...options}>
      {(ready) => (
        <AnimatePresence mode="wait">
          {ready ? (
            <MotionDiv key="children" initial="hidden" animate="visible" exit="exit" variants={fadeIn}>
              {onReady &&
                !onReadyCalled.current &&
                ((() => {
                  onReady();
                  onReadyCalled.current = true;
                })(),
                null)}
              {children}
            </MotionDiv>
          ) : (
            <MotionDiv key="loading" initial="hidden" animate="visible" exit="exit" variants={fadeIn}>
              {loading}
            </MotionDiv>
          )}
        </AnimatePresence>
      )}
    </HassProvider>
  );
});
