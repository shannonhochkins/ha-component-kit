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
import { Column, Row } from "@components";
import useLocaleExample from "./examples/useLocale.code?raw";
import findReplaceExample from "./examples/findReplace.code?raw";
import localesConstantExample from "./examples/localesConstant.code?raw";
import localizeFunctionExample from "./examples/localizeFunction.code?raw";
import useLocalesExample from "./examples/useLocales.code?raw";

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
OuterElementType.displayName = "OuterElementType";

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
  const itemData: React.ReactElement<HTMLElement>[] = [];
  (children as React.ReactElement<HTMLElement>[]).forEach(
    (item: React.ReactElement<HTMLElement> & { children?: React.ReactElement<HTMLElement>[] }) => {
      itemData.push(item);
      itemData.push(...(item.children || []));
    },
  );
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
          <h2>Key usage for &quot;{selectedKey}&quot;</h2>
          <p>
            A simple method you can import and use where ever you like as long as the component is rendered within HassConnect or it will
            just return the key name.
          </p>
          <Source
            dark
            code={localizeFunctionExample
              .replace(" as LocaleKeys", "")
              .replace(/{{selectedKey}}/g, selectedKey)
              .replace(/{{value}}/g, data?.[selectedKey as LocaleKeys] || "")}
          />
          <p>You can also use the useLocale hook which is less likely to be something you&apos;ll use but it is available.</p>
          <Source
            dark
            code={useLocaleExample
              .replace(" as LocaleKeys", "")
              .replace(/{{selectedKey}}/g, selectedKey)
              .replace(/{{value}}/g, data?.[selectedKey as LocaleKeys] || "")}
          />
        </>
      )}

      <h2>useLocales hook</h2>
      <p>
        This hook will simply return all available locales retrieved from Home Assistant, you don&apos;t need to use this hook at all unless
        you want to transform the value or inspect all values available. You can use the `localize` method directly anywhere in your
        application.
      </p>
      <Source dark code={useLocalesExample} />

      <h3>Find and replace</h3>

      <p>If you want to find/replace a value that&apos;s expected to be dynamic as it might contain a value wrapped in curly braces:</p>
      <Source dark code={findReplaceExample} />
      <h3>Fetch Locales</h3>
      <p>
        This is a list of all the available locales, including their hash names, but also including a fetch method which will download the
        assets and cache locally
      </p>
      <blockquote>
        <b>NOTE:</b> This is an example, you do NOT need to do this, it&apos;s automatically handled through HassConnect and retrieved from your
        home assistant instance.
      </blockquote>
      <Source dark code={localesConstantExample} />
      <p>
        Most of the time, what&apos;s available may work just fine for you, however if you want to replace the locales that the localize
        function uses across the board, you can call `updateLocales` manually, however this will not update the types for LocaleKeys so
        you&apos;ll need to most likely create a wrapping function for localize with your matching types.
      </p>
    </>
  );
}

export default {
  title: "core/hooks/useLocales",
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
