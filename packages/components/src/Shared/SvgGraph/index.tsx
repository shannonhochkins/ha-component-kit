import { useState, useEffect } from "react";
import styled from "@emotion/styled";
// Get the value at the end of a path in a nested object
const midPoint = (
  _Ax: number,
  _Ay: number,
  _Bx: number,
  _By: number
): number[] => {
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


export interface SvgGraphProps {
  coordinates?: number[][];
  strokeWidth?: number;
}

export function SvgGraph({ coordinates, strokeWidth = 5 }: SvgGraphProps) {
  const [path, setPath] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (coordinates) {
      // Implement your logic for deriving the 'path' from 'coordinates' here
      const newPath = getPath(coordinates); // This is just a placeholder
      setPath(newPath as string);
    }
  }, [coordinates]);

  return (
    <SVGWrapper width="100%" height="100%" viewBox="0 0 500 100">
      <g>
        {!!path && coordinates ? (
          <>
            <mask id="fill">
              <path
                className="fill"
                fill="white"
                d={`${path} L 500, 100 L 0, 100 z`}
              />
            </mask>
            <rect
              height="100%"
              width="100%"
              id="fill-rect"
              fill="var(--ha-A400)"
              mask="url(#fill)"
            />
            <mask id="line">
              <path
                fill="none"
                stroke="var(--ha-A400)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                d={path}
              />
            </mask>
            <rect
              height="100%"
              width="100%"
              id="rect"
              fill="var(--ha-A400)"
              mask="url(#line)"
            />
          </>
        ) : (
          <></>
        )}
      </g>
    </SVGWrapper>
  );
}
