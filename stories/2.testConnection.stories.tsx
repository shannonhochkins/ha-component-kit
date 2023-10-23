import { Story, Source } from "@storybook/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import { HassConnect, HassContext, useHass } from '@core';
import { useContext, useState, useEffect, useMemo } from "react";
import type {
  HassServices,
  HassEntities,
} from "home-assistant-js-websocket";
import { upperFirst, snakeCase, camelCase } from "lodash";
import {
  TextField,
  Button,
  Grid,
  FormHelperText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  CssBaseline,
  Alert
} from "@mui/material";

interface ApiTesterProps {
  domains: HassServices;
  entities: HassEntities;
}

function ApiTester({ domains, entities }: ApiTesterProps) {
  const { callService, getAllEntities, useStore } = useHass();
  const config = useStore(store => store.config);
  const [domain, setDomain] = useState<string>("light");
  const [service, setService] = useState<string>("");
  const [entity, setEntity] = useState<string>("");
  console.group('All Entities');
  console.log(getAllEntities());
  console.groupEnd();
  console.log('ConfigurationObject', config);
  const availableEntities = useMemo(() => {
    // filter the entities that are prefixed with the domain,
    return Object.entries(entities)
      .filter(([key]) => {
        return `${key}`.startsWith(domain);
      })
      .map(([key, value]) => {
        return {
          label:
            value?.attributes?.friendly_name || `${key}`.replace(`${domain}.`, ""),
          value: key,
        };
      });
  }, [entities, domain]);
  return (
    <Grid container direction="column" gap={2}>
      <Grid item>
        <Alert style={{
          marginTop: 20
        }} severity="success">
          You've authenticated successfully!
        </Alert>
      </Grid>
      <Grid item>
        <h2
          style={{
            marginTop: 20,
          }}
        >
          Service Tester
        </h2>
        <p>The options here are reflective or your home assistant instance.</p>
        <p>Pick your domain, then entity, then the service to test.</p>
        <p>
          <b>Note: </b> Some services may not have an entity to pick as a
          service might directly relate to an entity, or you don't have any
          entities for the service, keep note that a lot of these services have
          "data" that can be sent which is all typed in typescript for ease of
          use.
        </p>
      </Grid>
      <Grid container gap={2} wrap="nowrap">
        <Grid item xs={3}>
          <FormControl size="small" id="domain-label" fullWidth>
            <InputLabel>Domain</InputLabel>
            <Select
              size="small"
              label="Domain"
              labelId="domain-label"
              id="domain"
              value={domain}
              onChange={(e: SelectChangeEvent) => {
                const value = e.target.value;                
                  setDomain(value);
                  setService('');
                  setEntity('');
              }}
            >
              {Object.keys(domains)
                .sort()
                .map((d) => {
                  return (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  );
                })}
            </Select>
            <FormHelperText>Pick your domain</FormHelperText>
          </FormControl>
        </Grid>
        {domain && (
          <Grid item xs={3}>
            <FormControl size="small" id="entity-label" fullWidth>
              <InputLabel>Entity</InputLabel>
              <Select
                size="small"
                label="Entity"
                labelId="entity-label"
                id="entity"
                value={entity}
                onChange={(e: SelectChangeEvent) => {
                  const value = e.target.value;
                  setEntity(value);
                  setService('');
                }}
              >
                {availableEntities
                  .sort((a, b) => a.label.localeCompare(b.label))
                  .map((e) => {
                    return (
                      <MenuItem key={e.value} value={e.value}>
                        {e.label}
                      </MenuItem>
                    );
                  })}
              </Select>
              <FormHelperText>Pick your domain</FormHelperText>
            </FormControl>
          </Grid>
        )}
        {domain && entity && (
          <Grid item xs={3}>
            <FormControl size="small" id="service-label" fullWidth>
              <InputLabel>Service</InputLabel>
              <Select
                size="small"
                label="Service"
                labelId="service-label"
                id="service"
                value={service}
                onChange={(e: SelectChangeEvent) => {
                  // casting to light as we don't even know the value and light is the default
                  const value = e.target.value;
                  setService(value);
                }}
              >
                {Object.keys(domains[domain])
                  .sort()
                  .map((d) => {
                    return (
                      <MenuItem key={d} value={d}>
                        {d}
                      </MenuItem>
                    );
                  })}
              </Select>
              <FormHelperText>Pick your service</FormHelperText>
            </FormControl>
          </Grid>
        )}
        {domain && entity && service && (
          <Grid item xs={3}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                callService({
                  // @ts-expect-error - unknown domain
                  domain,
                  // @ts-expect-error - unknown service
                  service,
                  target: entity,
                });
              }}
            >
              Call Service
            </Button>
          </Grid>
        )}
      </Grid>
      {domain && entity && service && (
        <Grid item>
          <h3>Example Usage with useEntity</h3>
          <p>This simply exports a button that will {camelCase(service)} the {camelCase(domain)} when pressed!</p>
          <Source
            dark
            language="ts"
            code={`
export function Test${upperFirst(camelCase(domain))}{
  const { api } = useEntity('${entity}');
  return <button onClick={() => {
    api.${camelCase(service)}();
  }}
}`}
          />
        </Grid>
      )}
      {domain && entity && service && (
        <Grid item>
          <h3>Example Usage with callService</h3>
          <p>This simply exports a button that will {camelCase(service)} the {camelCase(domain)} when pressed!</p>
          <Source
            dark
            language="ts"
            code={`
export function Test${upperFirst(camelCase(domain))}{
  const { callService } = useHass();
  return <button onClick={() => {
    callService({
      domain: '${snakeCase(domain)}',
      service: '${snakeCase(service)}',
      target: '${entity}',
    })
  }}
}`}
          />
        </Grid>
      )}
      {domain && entity && service && (
        <Grid item>
          <h3>Example Usage with useService hook</h3>
          <p>This simply exports a button that will {camelCase(service)} the {camelCase(domain)} when pressed!</p>
          <Source
            dark
            language="ts"
            code={`
export function Test${upperFirst(camelCase(domain))}{
  const { ${camelCase(service)} } = useService('${camelCase(domain)}');
  return <button onClick={() => {
    ${camelCase(service)}('${entity}');
  }}
}`}
          />
        </Grid>
      )}
    </Grid>
  );
}

function UseData() {
  const { getAllEntities, getServices } = useContext(HassContext);
  const entities = getAllEntities();
  const [services, setServices] = useState<HassServices | null>(null);
  const hasEntities = useMemo(
    () => Object.keys(entities).length > 0,
    [entities]
  );
  useEffect(() => {
    async function fetchData() {
      const services = await getServices();
      // purposely casting the type here. We know that the keys of services are the same as SupportedServices
      setServices(services);
    }
    fetchData();
  }, [getServices]);

  if (!hasEntities) {
    return <h3>No entities found</h3>;
  }
  return (
    <>{services && <ApiTester entities={entities} domains={services} />}</>
  );
}

function Template() {
  const storedHassUrl = localStorage.getItem("hassUrl");
  const storedHassTokens = localStorage.getItem("hassTokens");
  const isAuthRedirect = window.location.href.includes("auth_callback");
  const [error, setError]  = useState<string>("");
  const [hassUrl, setHassUrl] = useState<string>(storedHassTokens === null && !isAuthRedirect ? "" : storedHassUrl || '');
  const [value, setValue] = useState<string>(storedHassUrl || "");
  const [ready, setReady] = useState<boolean>(isAuthRedirect || storedHassTokens !== null);

  useEffect(() => {
    if (!value) {
      setReady(false);
      localStorage.setItem("hassUrl", "");
    }
  }, [value]);
  return (
    <>
      <CssBaseline>
      <h2>Playground</h2>
      <Grid container alignItems="start" gap={2}>
        <Grid item>
          <FormControl
            size="small"
            id="service-label"
            style={{
              width: 450,
            }}
          >
            <TextField
              size="small"
              onChange={(e) => {
                setValue(e.target.value);
              }}
              label="Home Assistant URL"
              variant="outlined"
              value={value}
            />
            <FormHelperText error={!!error}>
              {error ? error : `Enter your Home Assistant URL, can be any https URL`}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item>
          <Button
            disabled={!value}
            onClick={() => {
              setError('');
              if (ready) {
                setReady(false);
                localStorage.removeItem('hassTokens');
                localStorage.setItem("hassUrl", "");
                setHassUrl('');
              } else {
                try {
                  const { origin } = new URL(value);
                  setHassUrl(origin);
                  setReady(true);
                  localStorage.setItem("hassUrl", value);
                } catch (e) {
                  setHassUrl('');
                  if (e instanceof Error) {
                    setError(e.message);
                  }
                }
              }
            }}
            variant="outlined"
          >
            {ready ? "RESET" : "ATTEMPT LOGIN"}
          </Button>
        </Grid>
      </Grid>
      </CssBaseline>
        {ready && <HassConnect hassUrl={hassUrl} options={{
          allowNonSecure: true,
        }}>
          <UseData />
        </HassConnect>}
    </>
  );
}

export default {
  title: "INTRODUCTION/Test Connection",
  component: HassConnect,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    width: "100%",
    docs: {
      description: {
        component: `Provide your home assistant origin url and it will connect if a valid url is provided, eg http://localhost:8123, if it fails to connect, refresh the page and ensure the url is correct.`
      }
    }
  },
} satisfies Meta<typeof HassConnect>;

export type Story = StoryObj<typeof Template>;

export const Playground = Template.bind({});
