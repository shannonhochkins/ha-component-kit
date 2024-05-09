/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useRef } from "react";
import { type CustomModalAnimation } from "@components";
import { create } from "zustand";

export interface Store extends ModalOptions {
  setModalAnimation: (animation: CustomModalAnimation) => void;
  setAnimationDuration: (duration: number) => void;
}

export const useModalStore = create<Store>((set) => ({
  setModalAnimation: (animation: CustomModalAnimation) => set({ modalAnimation: animation }),
  setAnimationDuration: (duration: number) => set({ animationDuration: duration }),
}));

export interface ModalOptions {
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
  const applied = useRef(false);
  const { setAnimationDuration, setModalAnimation } = useModalStore();
  useEffect(() => {
    if (typeof options.animationDuration === "number") {
      setAnimationDuration(options.animationDuration);
    }
    if (typeof options.modalAnimation === "function") {
      setModalAnimation(options.modalAnimation);
    }
    applied.current = true;
  }, [options, setModalAnimation, setAnimationDuration]);
  return <ModalContext.Provider value={options}>{applied.current && children}</ModalContext.Provider>;
}
