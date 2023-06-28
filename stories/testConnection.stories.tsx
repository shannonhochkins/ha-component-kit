import React from 'react';
import { Story, Canvas } from '@storybook/blocks';
import type { Meta, StoryObj } from '@storybook/react';
import { HassConnect } from '../src/components/HassConnect';
import { HassContext } from '../src/components/HassConnect/Provider';
import { useContext, useState, useEffect, useMemo } from 'react';
import type { HassEntity } from "home-assistant-js-websocket";
import { TextField, Button, Grid, FormHelperText, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Typography } from '@mui/material';

interface DataByType {
  [key: string]: HassEntity[];
}

function UseData() {
  const { getAllEntities, getStates, getConfig, getUser, getServices } = useContext(HassContext);
  const entities = getAllEntities();
  const hasEntities = useMemo(() => Object.keys(entities).length > 0, [entities]);
  const [service, setService] = useState<string | null>(null);
  const dataByType = Object.entries(entities).reduce<DataByType>((acc, [key, entity]) => {
    const group = key.split('.')[0];
    return {
      ...acc,
      [group]: [
        ...(acc[group] || []),
        entity,
      ],
    }
  }, {});

  useEffect(() => {
    async function fetchData() {
      const results = await Promise.all([
        getStates(),
        getConfig(),
        getUser(),
        getServices(),
      ]);
      const formatted = ['getStates', 'getConfig', 'getUser', 'getServices'].reduce((acc, key, index) => {
        return {
          ...acc,
          [key]: results[index],
        };
      }, {});
      console.log('Additional Instance Information', formatted);
    }
    fetchData();
  }, [getConfig, getServices, getStates, getUser])

  if (!hasEntities) {
    return <Typography component="h2">No entities found</Typography>
  }
  return <>
    <Grid container direction="column" gap={2}>
      <Grid item style={{
        marginTop: 20
      }}>
        <Typography component="h2">Your Services & Entities</Typography>
      </Grid>
      <Grid item>
        <FormControl id="service-label" style={{
            width: 300,
          }}>
          <InputLabel>Service</InputLabel>
          <Select label="Service" labelId="service-label" id="service" onChange={(e: SelectChangeEvent) => {
            setService(e.target.value);
          }}>
            {Object.keys(dataByType).map(service => {
              return <MenuItem key={service} value={service}>{service}</MenuItem>
            })}
          </Select>
          <FormHelperText>Pick your service</FormHelperText>
        </FormControl>
      </Grid>
      
      {service && <>
        <Grid item>
        <FormControl style={{
            width: 300,
          }}>
            <InputLabel>Entities for {service}</InputLabel>
            <Select label={`Entities for ${service}`}>
              {dataByType[service].map(entity => {
                return <MenuItem key={entity.entity_id} value={entity.entity_id}>{entity.attributes.friendly_name}</MenuItem>
              })}
            </Select>
            <FormHelperText>Pick your entity for {service}</FormHelperText>
          </FormControl>
      </Grid>
      
      </>}
    

    </Grid>
  </>
}



function Template() {
  const storedHassUrl = localStorage.getItem('hassUrl');
  const [hassUrl, setHassUrl] = useState<string>(storedHassUrl || '');
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    if (!hassUrl) {
      setReady(false);
      localStorage.setItem('hassUrl', '');
    }
  }, [hassUrl]);

  useEffect(() => {
    if (storedHassUrl) {
      setReady(true);
    }
  }, [storedHassUrl]);
  return <>
      <Grid container>
        <Grid item>
          <FormControl id="service-label" style={{
              width: 300,
            }}>
            <TextField size="small" onChange={e => setHassUrl(e.target.value)} label="Home Assistant URL" variant="outlined" value={hassUrl} />
            <FormHelperText>Enter your Home Assistant URL, can be any https URL</FormHelperText>
          </FormControl>
          
        </Grid>  
        <Grid item>
          <Button style={{
            marginLeft: 10,
            marginTop: 1
          }} onClick={() => {
            if (ready) {
              setReady(false);
              localStorage.setItem('hassUrl', '');
            } else {
              setReady(true);
              localStorage.setItem('hassUrl', hassUrl);
            }
          }} variant='outlined'>{ready ? 'CLEAR' : 'ATTEMPT LOGIN'}</Button>
        </Grid>
      </Grid>
      {ready && <HassConnect hassUrl={hassUrl}>
        <UseData />
        <br />
        Now that you're connected, have a look at your developer console to see more formatted information
        about your HA instance.
      </HassConnect>}
    </>;
}

export default {
  title: 'INTRODUCTION/TestConnection',
  component: HassConnect,
  parameters: {
    layout: 'centered'
  },
} satisfies Meta<typeof HassConnect>;

export type Story = StoryObj<typeof Template>;

export const Playground = Template.bind({});




