import { AllDomains, HassEntityWithService } from "@hakit/core";

export interface StateProps extends React.ComponentProps<"div"> {
  entity: HassEntityWithService<AllDomains>;
}
