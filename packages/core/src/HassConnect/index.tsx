import { type ReactNode } from "react";
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
export const HassConnect = ({ children, hassUrl, loading = <Loader />, onReady, options = {} }: HassConnectProps): React.ReactNode => {
  const onReadyCalled = useRef(false);

  if (!hassUrl) {
    return <>{`Provide the hassUrl prop with the url to your home assistant instance.`}</>;
  }

  return (
    <HassProvider hassUrl={hassUrl} {...options}>
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
};
