import { formatNumber } from "@hakit/core";
import styled from "@emotion/styled";

const StyledBigNumber = styled.div`
  font-size: 57px;
  line-height: 1.12;
  letter-spacing: -0.25px;
  .value {
    display: flex;
    margin: 0;
    direction: ltr;
  }
  .displayed-value {
    display: inline-flex;
    flex-direction: row;
    align-items: flex-end;
  }
  .addon {
    display: flex;
    flex-direction: column-reverse;
    padding: 4px 0;
    height: 100%;
  }
  .addon.bottom {
    flex-direction: column;
    align-items: baseline;
  }
  .addon.bottom .unit {
    margin-bottom: 4px;
    margin-left: 2px;
  }
  .value .decimal {
    font-size: 0.42em;
    line-height: 1.33;
  }
  .value .unit {
    font-size: 0.33em;
    line-height: 1.26;
  }
  /* Accessibility */
  .visually-hidden {
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    height: 1px;
    width: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
  }
`;

export interface BigNumberProps {
  value: number;
  unit?: string;
  unitPosition?: "top" | "bottom";
  formatOptions?: Intl.NumberFormatOptions;
}

export function BigNumber({ value, unit, unitPosition = "top", formatOptions = {} }: BigNumberProps) {
  const formatted = formatNumber(value, formatOptions);

  const [integer] = formatted.includes(".") ? formatted.split(".") : formatted.split(",");

  const decimal = formatted.replace(integer, "");

  const formattedValue = `${value}${unit ? `${unit}` : ""}`;

  const unitBottom = unitPosition === "bottom";

  return (
    <StyledBigNumber>
      <p className="value">
        <span aria-hidden="true" className="displayed-value">
          <span>{integer}</span>
          <span className={`addon ${unitBottom ? "bottom" : ""}`}>
            <span className="decimal">{decimal}</span>
            <span className="unit">{unit}</span>
          </span>
        </span>
        <span className="visually-hidden">{formattedValue}</span>
      </p>
    </StyledBigNumber>
  );
}
