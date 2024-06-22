import { Story, Source, Title, Description } from "@storybook/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import { LocaleKeys, locales } from "@hakit/core";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Divider,
  Autocomplete,
  autocompleteClasses,
  TextField,
  ListItem,
  ListItemText,
} from "@mui/material";
import React, { useState, useEffect, forwardRef } from "react";
import Popper from "@mui/material/Popper";
import { styled } from "@mui/material/styles";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { VariableSizeList, ListChildComponentProps } from "react-window";
import { Column, Row } from "@hakit/components";

const ITEM_HEIGHT = 48;

const renderRow = ({ data, index, style }: ListChildComponentProps) => {
  const option = data[index];
  const [props, value] = option;
  return (
    <ListItem component="li" {...props} style={style} key={value.key}>
      <ListItemText primary={value.value} secondary={value.key} />
    </ListItem>
  );
};

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});
0;

function useResetCache(data: number) {
  const ref = React.useRef<VariableSizeList>(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

const ListboxComponent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData: React.ReactElement[] = [];
  (children as React.ReactElement[]).forEach((item: React.ReactElement & { children?: React.ReactElement[] }) => {
    itemData.push(item);
    itemData.push(...(item.children || []));
  });
  const itemCount = itemData.length;
  const height = Math.min(8, itemCount) * ITEM_HEIGHT;
  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          height={height}
          itemCount={itemCount}
          itemSize={() => ITEM_HEIGHT}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          overscanCount={5}
          itemData={itemData}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

function Page() {
  const [loading, setLoading] = useState(false);
  const [option, setOption] = useState("en");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [data, setData] = useState<Record<LocaleKeys, string> | null>(null);

  const handleChange = (event: SelectChangeEvent) => {
    setOption(event.target.value as string);
  };

  useEffect(() => {
    const match = locales.find((locale) => locale.code === option);
    if (match) {
      setLoading(true);
      match.fetch().then((data) => {
        setData(data);
        setLoading(false);
      });
    }
  }, [option]);

  const optionObjects = Object.entries(data || {}).map(([key, value]) => ({
    key,
    value,
  }));

  useEffect(() => {
    if (!selectedKey && optionObjects[0]) {
      setSelectedKey(optionObjects[0].key);
    }
  }, [optionObjects, selectedKey]);

  const handleOptionSelect = (_event: React.SyntheticEvent, value: Record<string, string> | null) => {
    if (value) {
      setSelectedKey(value.key);
    }
  };

  return (
    <>
      <Title />
      <h5>
        <Column alignItems="start" justifyContent="start" gap="0.5rem">
          <mark>{`useLocales(): Record<LocaleKeys, string>`}</mark>
          <mark>{`useLocale(key: LocaleKeys, options: Options)`}</mark>
          <mark>{`localize(key: LocaleKeys, options: Options)`}</mark>
          <mark>{`locales: Locale[]`}</mark>
          <mark>{`updateLocales(locales: Record<string, string>): void`}</mark>
        </Column>
      </h5>
      <Description />
      <p>You can change the language here and then find the locale in the dropdown to use within your application.</p>
      <Row gap="1rem" alignItems="start" justifyContent="start" fullWidth wrap="nowrap">
        <FormControl
          style={{
            width: "50%",
          }}
        >
          <InputLabel id="language-label">Language</InputLabel>
          <Select labelId="language-label" id="language" value={option} label="Language" onChange={handleChange}>
            {locales.map((locale) => {
              return (
                <MenuItem key={locale.hash} value={locale.code}>
                  {locale.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        {data && optionObjects && !loading && (
          <Autocomplete
            style={{
              width: "50%",
            }}
            defaultValue={optionObjects[0]}
            disableListWrap
            PopperComponent={StyledPopper}
            options={optionObjects}
            getOptionLabel={(option) => option.key}
            ListboxComponent={ListboxComponent}
            renderInput={(params) => <TextField {...params} label="Find Locale" />}
            renderOption={(props, option, state) => [props, option, state.index] as React.ReactNode}
            onChange={handleOptionSelect}
          />
        )}
      </Row>

      <Divider
        style={{
          margin: "1rem 0",
        }}
      />

      {selectedKey && (
        <>
          <h2>Key usage for "{selectedKey}"</h2>
          <p>
            A simple method you can import and use where ever you like as long as the component is rendered within HassConnect or it will
            just return the key name.
          </p>
          <Source
            dark
            code={`
// usage with the localize function
import { localize } from '@hakit/core';
export function MyComponent() {
  const value = localize('${selectedKey}');
  return <>{value}</>; // should translate to "${data?.[selectedKey as LocaleKeys]}"
}
      `}
          />
          <p>You can also use the useLocale hook which is less likely to be something you'll use but it is available.</p>
          <Source
            dark
            code={`
// usage with the localize function
import { useLocale } from '@hakit/core';
export function MyComponent() {
  const value = useLocale('${selectedKey}');
  return <>{value}</>; // should translate to "${data?.[selectedKey as LocaleKeys]}"
}
      `}
          />
        </>
      )}

      <h2>Examples</h2>
      <p>
        This hook will simply return all available locales retrieved from Home Assistant, you don't need to use this hook at all unless you
        want to transform the value or inspect all values available. You can use the `localize` method directly anywhere in your
        application.
      </p>
      <Source
        dark
        code={`
  import { useLocales } from '@hakit/core';
  export function MyComponent() {
  const locales = useLocales();
  return <>{Object.keys(locales).join(', ')}</>;
  }
      `}
      />

      <p>If you want to find/replace a value that's expected to be dynamic as it might contain a value wrapped in curly braces:</p>
      <Source
        dark
        code={`
  import { localize, useCalendar } from '@hakit/core';
  export function MyComponent() {
  const calendar = useCalendar('calendar.mycal');
  return <>{localize('panel.calendar', {
  search: '{state}',
  replace: calendar.state,
  fallback: 'Calendar is not available' // this will be used if \`panel.calendar\` is not available in the locales
  })}</>;
  }
      `}
      />

      <p>
        This is a list of all the available locales, including their hash names, but also including a fetch method which will download the
        assets and cache locally
      </p>
      <p>
        Note: This is an example, you do NOT need to do this, it's automatically handled through HassConnect and retrieved from your home
        assistant instance.
      </p>
      <Source
        dark
        code={`
  import { locales } from '@hakit/core';
  const locale = locales.find(({ code }) => code === 'en');

  async function fetchEnLocale() {
  const data = await locale.fetch();
  console.log(data)
  return data;
  }
    `}
      />
      <p>
        Most of the time, what's available may work just fine for you, however if you want to replace the locales that the localize function
        uses across the board, you can call `updateLocales` manually, however this will not update the types for LocaleKeys so you'll need
        to most likely create a wrapping function for localize with your matching types.
      </p>
    </>
  );
}

export default {
  title: "HOOKS/useLocales",
  tags: ["autodocs"],
  parameters: {
    centered: true,
    height: "auto",
    docs: {
      page: () => <Page />,
      description: {
        component: `A hook/helper that will retrieve available locales for your current language which are automatically retrieved from Home Assistant.`,
      },
    },
  },
} satisfies Meta;

export type Story = StoryObj;
export const Docs: Story = {
  args: {},
};
