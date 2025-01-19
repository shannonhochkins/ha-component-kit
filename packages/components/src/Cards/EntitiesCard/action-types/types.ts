import { AllDomains, HassEntityWithAction } from "@hakit/core";

export interface StateProps extends React.ComponentProps<"div"> {
  entity: HassEntityWithAction<AllDomains>;
}
