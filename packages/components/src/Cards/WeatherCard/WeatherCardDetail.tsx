import styled from "@emotion/styled";
import { ReactNode } from "react";
import { useEntity } from "@hakit/core";
import type { EntityName, HassEntityWithService, ExtractDomain } from "@hakit/core";
import { Icon } from "@iconify/react";
import { Row, fallback, Tooltip, mq } from "@components";
import type { RowProps } from "@components";
import { ErrorBoundary } from "react-error-boundary";

const DetailsRow = styled(Row)`
  width: calc(50% - 1rem);
  ${mq(
    ["xxs"],
    `
    width: 100%;
  `,
  )}
`;

const State = styled.div`
  color: var(--ha-S500-contrast);
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export interface WeatherCardDetailProps extends Omit<RowProps, "title"> {
  icon?: string;
  entity: EntityName;
  title?: ReactNode;
  suffix?: ReactNode;
  render?: (value: HassEntityWithService<ExtractDomain<EntityName>>) => ReactNode;
}

function _WeatherCardDetail({ icon, entity, title, suffix, render, ...rest }: WeatherCardDetailProps) {
  const _entity = useEntity(entity);
  const _title = title ?? _entity.attributes.friendly_name ?? "";
  return (
    <DetailsRow className="details" gap="0rem" justifyContent="flex-start" {...rest}>
      <Tooltip title={_title ?? "unknown title"}>
        <Row className="row" fullWidth gap="0.5rem" justifyContent="flex-start">
          <Icon className="icon" icon={icon ?? _entity.attributes.icon ?? "mdi:info"} />
          <State className="state">
            {typeof render === "function"
              ? render(_entity)
              : `${_title ? `${_title} - ` : ""}${_entity.state ?? ""}${
                  !suffix && _entity.attributes.unit_of_measurement ? `${_entity.attributes.unit_of_measurement}` : suffix ?? ""
                }`}
          </State>
        </Row>
      </Tooltip>
    </DetailsRow>
  );
}

export function WeatherCardDetail(props: WeatherCardDetailProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "_WeatherCardDetail" })}>
      <_WeatherCardDetail {...props} />
    </ErrorBoundary>
  );
}
