import { useState, useEffect, useRef, ComponentPropsWithoutRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
// Get the value at the end of a path in a nested object
const midPoint = (_Ax: number, _Ay: number, _Bx: number, _By: number): number[] => {
  const _Zx = (_Ax - _Bx) / 2 + _Bx;
  const _Zy = (_Ay - _By) / 2 + _By;
  return [_Zx, _Zy];
};

const getPath = (coords: number[][]): string => {
  if (!coords.length) {
    return "";
  }

  let next: number[];
  let Z: number[];
  const X = 0;
  const Y = 1;
  let path = "";
  let last = coords.filter(Boolean)[0];

  path += `M ${last[X]},${last[Y]}`;

  for (const coord of coords) {
    next = coord;
    Z = midPoint(last[X], last[Y], next[X], next[Y]);
    path += ` ${Z[X]},${Z[Y]}`;
    path += ` Q${next[X]},${next[Y]}`;
    last = next;
  }

  path += ` ${next![X]},${next![Y]}`;
  return path;
};

const SVGWrapper = styled.svg`
  display: flex;
  width: 100%;
  .fill {
    opacity: 0.1;
  }
`;

export interface SvgGraphProps extends ComponentPropsWithoutRef<"svg"> {
  coordinates?: number[][];
  strokeWidth?: number;
}

export function SvgGraph({ coordinates, strokeWidth = 5, cssStyles, className, ...rest }: SvgGraphProps) {
  const [path, setPath] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (coordinates) {
      const newPath = getPath(coordinates);
      setPath(newPath);
    }
  }, [coordinates]);
  // needs to be unique per components so the mask/fill works correctly.
  // Generate a unique ID for this component instance.
  const idRef = useRef(`svg-${Math.random().toString(36).substr(2, 9)}`);
  const id = idRef.current;

  return (
    <SVGWrapper
      className={`${className ?? ""} svg-graph`}
      width="100%"
      height="100%"
      viewBox="0 0 500 100"
      css={css`
        ${cssStyles ?? ""}
      `}
      {...rest}
    >
      <g>
        {!!path && coordinates ? (
          <>
            <mask id={`${id}-fill`}>
              <path className="fill" fill="white" d={`${path} L 500, 100 L 0, 100 z`} />
            </mask>
            <rect height="100%" width="100%" fill="var(--ha-A400)" mask={`url(#${id}-fill)`} />
            <mask id={`${id}-line`}>
              <path fill="none" stroke="var(--ha-A100)" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" d={path} />
            </mask>
            <rect height="100%" width="100%" fill="var(--ha-A400)" mask={`url(#${id}-line)`} />
          </>
        ) : (
          <></>
        )}
      </g>
    </SVGWrapper>
  );
}
