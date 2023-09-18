import { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { useDebouncedCallback } from "use-debounce";

const StyledRange = styled.div<{
  handleSize: number;
}>`
  ${(props) => `
    width: 100%;
    position: relative;
    isolation: isolate;
    z-index: 1;

    .range-slider-range {
      position: relative;
      -webkit-appearance: none;
      width: 100%;
      height: 0.7rem;
      border-radius: 5px;
      background: var(--ha-S400);
      outline: none;
      padding: 0;
      margin: 0;
      z-index: 1;

      &::-webkit-slider-thumb {
        appearance: none;
        width: ${props.handleSize}px;
        height: ${props.handleSize}px;
        border-radius: 50%;
        background: var(--ha-A400);
        cursor: pointer;
        transition: background var(--ha-transition-duration) var(--ha-easing);
        position: relative;
        z-index: 1;

        &:hover {
          background: var(--ha-A200);
        }
      }

      &:active::-webkit-slider-thumb {
        background: var(--ha-A400);
      }

      &::-moz-range-thumb {
        width: ${props.handleSize}px;
        height: ${props.handleSize}px;
        border: 0;
        border-radius: 50%;
        background: var(--ha-A400);
        cursor: pointer;
        transition: background var(--ha-transition-duration) var(--ha-easing);
        z-index: 1;

        &:hover {
          background: var(--ha-A200);
        }
      }

      &:active::-moz-range-thumb {
        background: var(--ha-A400);
      }
      
      &:focus {
        &::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px var(--ha-A100);
        }
      }
    }

    // Firefox Overrides
    ::-moz-range-track {
        background: var(--ha-S400);
        border: 0;
    }

    input::-moz-focus-inner,
    input::-moz-focus-outer { 
      border: 0; 
    }

    
    &:hover {
      .tooltip-holder {
        > div {
          transform: translate(-50%, -1rem) rotate(-45deg);
          opacity: 1;
        }
      }
    }
  `}
`;

const Tooltip = styled.div`
  opacity: 0;
  position: absolute;
  bottom: 100%;
  width: 2rem;
  height: 2rem;
  border-radius: 50% 50% 50% 0;
  left: 0;
  transform: translate(-50%, 1rem) rotate(-45deg);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: transform, opacity;
  background-color: var(--ha-A400);
  white-space: nowrap;
  pointer-events: none;
  z-index: 0;
  &:after {
    content: attr(data-title);
    font-size: 12px;
    display: flex;
    align-items:center;
    justify-content: center;
    color: white;
    transform: rotate(45deg);
    position: absolute;
    inset: 0;
    border-radius: 50%;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
`;

export function RangeSlider(
  props: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onInput' | 'onChange'
  > & {
    handleSize?: number;
    onChange?: (value: number) => void;
    label?: string;
    /** should the tooltip value be hidden @default false */
    hideTooltip?: boolean;
  }
) {
  const [value, setValue] = useState(props.value ?? 0);
  const [isDragging, setIsDragging] = useState(false);
  const rangeRef = useRef<HTMLInputElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const handleSize = props.handleSize ?? 15;

  useEffect(() => {
    if (typeof props.value === 'number') {
      setValue(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    if (!rangeRef.current || props.hideTooltip) return;
    const min = parseFloat(`${props.min ?? 0}`);
    const max = parseFloat(`${props.max ?? 100}`);
    const step = parseFloat(`${props.step ?? 1}`);
    const roundedValue = parseFloat(rangeRef.current.valueAsNumber.toFixed(step < 1 ? Math.abs(Math.log10(step)) : 0));
    const percentage = ((rangeRef.current.valueAsNumber - min) / (max - min)) * 100;
    
    if (tooltipRef.current) {
      tooltipRef.current.style.left = `${percentage}%`;
      tooltipRef.current.setAttribute('data-title', `${roundedValue}`);
    }
  }, [value, props.min, props.max, props.step, props.hideTooltip]);

  const debouncedOnChange = useDebouncedCallback((value: number) => {
    if (typeof props.onChange === 'function') {
      props.onChange(value);
    }
  }, 300);

  return (
    <div style={{ position: 'relative' }}>
      {props.label && <Label>{props.label}</Label>}
      <StyledRange
        handleSize={handleSize}
        className={`range-slider ${props.className}`}
      >
        <input
          {...props}
          ref={rangeRef}
          type="range"
          className="range-slider-range"
          value={value}
          onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
            setValue(event.target.valueAsNumber);
          }}
          onChange={(event) => {
            debouncedOnChange(event.target.valueAsNumber);
          }}
        />
        {!props.hideTooltip && <div className="tooltip-holder" style={{
          position: 'absolute',
          top: 0,
          left: handleSize / 2,
          right: handleSize / 2,
        }}>
          <Tooltip ref={tooltipRef} />
        </div>}
      </StyledRange>
    </div>
  );
}
