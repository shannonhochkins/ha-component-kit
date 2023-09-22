import { useState } from "react";
import styled from "@emotion/styled";
// Get the value at the end of a path in a nested object
// const getPath = (
//   data: Coordinate[],
//   path: Array<keyof Coordinate>,
// ): number | undefined => {
//   if (path.length === 1 && path[0] in data) {
//     return data[path[0]];
//   }
//   if (data[path[0]] === undefined) {
//     return undefined;
//   }
//   return getPath(data[path[0]], path.slice(1));
// };

const SVGWrapper = styled.svg`
  :host {
    display: flex;
    width: 100%;
  }
  .fill {
    opacity: 0.1;
  }
`;

type Coordinate = { x: number; y: number };

export interface SvgGraphProps {
  coordinates?: Coordinate[];
  strokeWidth?: number;
}

export function SvgGraph({ coordinates, strokeWidth = 5 }: SvgGraphProps) {
  const [path] = useState<string | undefined>(undefined);

  // useEffect(() => {
  //   if (coordinates) {
  //     // Implement your logic for deriving the 'path' from 'coordinates' here
  //     const newPath = getPath(coordinates, ["x", "y"]); // This is just a placeholder
  //     setPath(newPath as string);
  //   }
  // }, [coordinates]);

  return (
    <SVGWrapper width="100%" height="100%" viewBox="0 0 500 100">
      <g>
        {path && coordinates ? (
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
              fill="var(--accent-color)"
              mask="url(#fill)"
            />
            <mask id="line">
              <path
                fill="none"
                stroke="var(--accent-color)"
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
              fill="var(--accent-color)"
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
