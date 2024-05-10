import { useMemo } from "react";
import styled from "@emotion/styled";
import { Row, CardBase, ButtonBar, ButtonBarButton, type CardBaseProps, type AvailableQueries, fallback } from "@components";
import type { VacuumControlsProps } from "@components";
import { useHass, useEntity, useIconByDomain, isUnavailableState, useIconByEntity, type EntityName, type FilterByDomain } from "@hakit/core";
import { VacuumToolbar } from '../../Shared/VacuumControls';
import { icons } from "../../Shared/VacuumControls/shared";
import { ErrorBoundary } from "react-error-boundary";

const StyledVacuumCard = styled(CardBase)`
  
`;

const Contents = styled.div`
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
`;

const Gap = styled.div`
  height: 20px;
`;

const LayoutBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`;

const Title = styled.div`
  color: var(--ha-secondary-color);
  font-size: 0.7rem;
`;
const Icon = styled.div`
  color: var(--ha-primary-active);
`;
const Description = styled.div`
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  text-transform: capitalize;
`;
type OmitProperties = '';
export type VacuumCardProps = Omit<CardBaseProps<"div", FilterByDomain<EntityName, "vacuum">>, OmitProperties> & {
  /** An optional override for the title */
  title?: string;
} & VacuumControlsProps;

function _VacuumCard({
  entity: _entity,
  title: _title,
  onClick,
  shortcuts,
  hideCurrentBatteryLevel,
  hideState = false,
  hideUpdated = false,
  hideToolbar = false,
  disabled,
  className,
  cssStyles,
  serviceData,
  service,
  modalProps,
  ...rest
}: VacuumCardProps): JSX.Element {
  const { useStore } = useHass();
  const globalComponentStyle = useStore((state) => state.globalComponentStyles);
  const entity = useEntity(_entity);
  const entityIcon = useIconByEntity(_entity);
  const domainIcon = useIconByDomain("vacuum");
  const title = _title || entity.attributes.friendly_name;
  const isDocked = entity.state === "docked";
  const isUnavailable = typeof entity?.state === "string" ? isUnavailableState(entity.state) : false;

  const titleValue = useMemo(() => {
    // I think the title value should just be entity.state
    // to show you if it's returning to home, or cleaning, or paused, etc
    if (isDocked) {
      return "docked";
    }
    return "cleaning";
  }, [isDocked]);

  return (
    <StyledVacuumCard
      title={title ?? undefined}
      disabled={disabled || isUnavailable}
      onClick={onClick}
      className={`${className ?? ""} vacuum-card`}
      modalProps={{
        ...modalProps,
        hideCurrentBatteryLevel,
        hideState,
        hideUpdated,
        hideToolbar,
      }}
      entity={_entity}
      // @ts-expect-error - don't know the entity name, so we can't know the service type
      service={service}
      // @ts-expect-error - don't know the entity name, so we can't know the service data
      serviceData={serviceData}
      disableActiveState
      disableRipples
      cssStyles={`
        ${globalComponentStyle.vacuumCard ?? ""}
        ${cssStyles ?? ""}
      `}
      {...rest}
    >
      <Contents>
        <LayoutBetween>
          <Description>
            <Icon
            >
              {entityIcon || domainIcon}
            </Icon>{" "}
            {title} - {titleValue}
          </Description>
          <Title>{entity.custom.relativeTime}</Title>
        </LayoutBetween>
        <Gap />
        <Row gap="0.5rem" justifyContent="space-between">
          <VacuumToolbar entity={_entity} hideToolbar={hideToolbar} />
          {(shortcuts ?? []).length > 0 && <ButtonBar>
            {(shortcuts ?? [])
              .concat()
              .filter((x) => !!x)
              .map(({ onClick, active, ...rest }, index) => (
                <ButtonBarButton
                  size={35}
                  iconColor={active ? 'var(--ha-300)' : undefined}
                  rippleProps={{
                    preventPropagation: true,
                  }}
                  key={index}
                  active={active}
                  onClick={() => onClick(entity)}
                  {...rest}
                />
              ))}
          </ButtonBar>}
        </Row>
      </Contents>
    </StyledVacuumCard>
  );
}

/** The VacuumCard is a card to easily interact with vacuum entities, you should have full control over your vacuum entity and even more controls when you long press on the card.
 */
export function VacuumCard(props: VacuumCardProps) {
  const defaultColumns: AvailableQueries = {
    xxs: 12,
    xs: 6,
    sm: 6,
    md: 4,
    lg: 4,
    xlg: 3,
  };
  return (
    <ErrorBoundary {...fallback({ prefix: "VacuumCard" })}>
      <_VacuumCard {...defaultColumns} {...props} />
    </ErrorBoundary>
  );
}