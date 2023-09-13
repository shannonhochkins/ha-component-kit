import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useDebouncedCallback } from "use-debounce";

const StyledRange = styled.div<{
  handleSize: number;
}>`
  ${(props) => `
    width: 100%;

    .range-slider__range {
      -webkit-appearance: none;
      width: 100%;
      height: 10px;
      border-radius: 5px;
      background: var(--ha-secondary-background);
      outline: none;
      padding: 0;
      margin: 0;

      &::-webkit-slider-thumb {
        appearance: none;
        width: ${props.handleSize}px;
        height: ${props.handleSize}px;
        border-radius: 50%;
        background: var(--ha-primary-active);
        cursor: pointer;
        transition: background .15s ease-in-out;

        &:hover {
          background: var(--ha-primary-active);
        }
      }

      &:active::-webkit-slider-thumb {
        background: var(--ha-primary-active);
      }

      &::-moz-range-thumb {
        width: ${props.handleSize}px;
        height: ${props.handleSize}px;
        border: 0;
        border-radius: 50%;
        background: var(--ha-primary-active);
        cursor: pointer;
        transition: background .15s ease-in-out;

        &:hover {
          background: var(--ha-primary-active);
        }
      }

      &:active::-moz-range-thumb {
        background: var(--ha-primary-active);
      }
      
      &:focus {
        
        &::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px var(--ha-primary-color),
                      0 0 0 6px var(--ha-primary-background);
        }
      }
    }

    // Firefox Overrides
    ::-moz-range-track {
        background: var(--ha-secondary-background);
        border: 0;
    }

    input::-moz-focus-inner,
    input::-moz-focus-outer { 
      border: 0; 
    }
  `}
`;

export function RangeSlider(
  props: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onInput" | "onChange"
  > & {
    handleSize?: number;
    onChange?: (value: number) => void;
  },
) {
  const [value, setValue] = useState(props.value ?? 0);
  useEffect(() => {
    if (typeof props.value === "number") {
      setValue(props.value);
    }
  }, [props.value]);

  const debouncedOnChange = useDebouncedCallback((value: number) => {
    if (typeof props.onChange === "function") {
      props.onChange(value);
    }
  }, 300);
  return (
    <StyledRange
      handleSize={props.handleSize ?? 20}
      className={`range-slider ${props.className}`}
    >
      <input
        {...props}
        type="range"
        className="range-slider__range"
        value={value}
        onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
          setValue(event.target.valueAsNumber);
        }}
        onChange={(event) => {
          debouncedOnChange(event.target.valueAsNumber);
        }}
      />
    </StyledRange>
  );
}
