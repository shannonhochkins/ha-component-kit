import { useMemo, useState, useCallback } from "react";
import styled from "@emotion/styled";
import { type AvailableQueries, fallback } from "@components";
import type { VacuumControlsProps } from "@components";
import { useHass, useEntity, localize, type EntityName, type FilterByDomain } from "@hakit/core";
import { VacuumImage } from "../../Shared/Entity/Vacuum/VacuumControls/VacuumImage";
import { ErrorBoundary } from "react-error-boundary";
import { getToolbarActions } from "../../Shared/Entity/Vacuum/VacuumControls/shared";
import { FeatureEntity } from "../CardBase/FeatureEntity";
import { ButtonCard, type ButtonCardProps } from "../ButtonCard";

const StyledVacuumCard = styled(ButtonCard)`
  .footer {
    margin-top: 0.5rem;
  }
`;

const StyledVacuumImage = styled(VacuumImage)`
  width: 100%;
`;

type OmitProperties = "title" | "features";
export type VacuumCardProps = Omit<ButtonCardProps<FilterByDomain<EntityName, "vacuum">>, OmitProperties> & {
  /** An optional override for the title */
  title?: string;
} & VacuumControlsProps;

function _VacuumCard({
  entity: _entity,
  shortcuts,
  hideCurrentBatteryLevel,
  hideState = false,
  hideUpdated = false,
  hideToolbar = false,
  className,
  cssStyles,
  serviceData,
  service,
  modalProps,
  customImage,
  locatingNode,
  ...rest
}: VacuumCardProps): JSX.Element {
  const { useStore } = useHass();
  const [flash, setFlash] = useState(false);
  const globalComponentStyle = useStore((state) => state.globalComponentStyles);
  const entity = useEntity(_entity);

  const titleValue = useMemo(() => {
    return flash ? locatingNode ?? `${localize("locate")}...` : entity.attributes.status ?? entity.state;
  }, [entity.attributes.status, locatingNode, entity.state, flash]);

  const locateFlash = useCallback(() => {
    setFlash(true);
    setTimeout(() => {
      setFlash(false);
    }, 2000);
  }, []);

  const features = getToolbarActions({
    entity,
    shortcuts,
    onLocate() {
      locateFlash();
    },
  });
  return (
    <StyledVacuumCard
      className={`${className ?? ""} vacuum-card`}
      modalProps={{
        stateTitle: titleValue,
        locatingNode,
        hideCurrentBatteryLevel,
        hideState,
        hideUpdated,
        hideToolbar,
        shortcuts,
        ...modalProps,
      }}
      entity={_entity}
      // @ts-expect-error - don't know the entity name, so we can't know the service type
      service={service}
      // @ts-expect-error - don't know the entity name, so we can't know the service data
      serviceData={serviceData}
      disableActiveState
      disableRipples
      hideToggle
      cssStyles={`
        ${globalComponentStyle.vacuumCard ?? ""}
        ${cssStyles ?? ""}
      `}
      icon={<StyledVacuumImage src={customImage} className={entity.state} />}
      customRenderState={() => titleValue}
      fabProps={{
        style: {
          padding: 0,
          backgroundColor: "none",
          width: "3rem",
          height: "3rem",
        },
      }}
      features={features.map((feature) => (
        <FeatureEntity
          iconProps={{
            color: feature?.active ? "var(--ha-300)" : undefined,
          }}
          {...feature}
        />
      ))}
      {...rest}
    />
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
