/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useRef } from "react";
import { type CustomModalAnimation } from "@components";
import { create } from "zustand";
import { MotionConfig, type MotionConfigProps } from "framer-motion"


export interface Store extends ModalOptions {
  setModalAnimation: (animation: CustomModalAnimation) => void;
  setAnimationDuration: (duration: number) => void;
}

export const useModalStore = create<Store>((set) => ({
  setModalAnimation: (animation: CustomModalAnimation) => set({ modalAnimation: animation }),
  setAnimationDuration: (duration: number) => set({ animationDuration: duration }),
}));

export interface ModalOptions extends Omit<MotionConfigProps, 'children' | 'isValidProp'> {
  /** override the global animation duration */
  animationDuration?: number;
  /** controls for the modalAnimations globally, by default the modal will animate expanding from the originating card */
  modalAnimation?: CustomModalAnimation;
}

export const ModalContext = createContext<ModalOptions>({} as ModalOptions);

export interface ModalProviderProps {
  /** children to provide the context to */
  children: React.ReactNode;
  /** options to provide to the modal context */
  options?: ModalOptions;
}

export function ModalProvider({ children, options = {} }: ModalProviderProps): React.ReactNode {
  const { animationDuration, modalAnimation, ...rest } = options;
  const hasAnimationDuration = typeof animationDuration === "number";
  const hasModalAnimation = typeof modalAnimation === "function";
  const applied = useRef((hasAnimationDuration || hasModalAnimation) ? false : true);
  const { setAnimationDuration, setModalAnimation } = useModalStore();
  useEffect(() => {
    if (typeof animationDuration === "number") {
      setAnimationDuration(animationDuration);
    }
    if (typeof modalAnimation === "function") {
      setModalAnimation(modalAnimation);
    }
    applied.current = true;
  }, [setModalAnimation, setAnimationDuration, animationDuration, modalAnimation]);
  return <MotionConfig {...rest}>
    <ModalContext.Provider value={options}>{applied.current && children}</ModalContext.Provider>
  </MotionConfig>
}
