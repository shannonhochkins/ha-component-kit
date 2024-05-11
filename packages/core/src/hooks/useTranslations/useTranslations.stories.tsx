import { Story, Source, Title, Description } from "@storybook/blocks";
import type { Meta, StoryObj } from "@storybook/react";

export default {
  title: "HOOKS/useTranslations",
  tags: ["autodocs"],
  parameters: {
    centered: true,
    height: "auto",
    docs: {
      page: () => (
        <>
          <Title />
          <h5>
            <mark>{`useTranslations()`}</mark>
          </h5>
          <Description />
          <p>
            This hook will simply return all available translations retrieved from Home Assistant, you don't need to use this hook at all
            unless you want to transform the value. You can use the `localize` method directly anywhere in your application.
          </p>

          <p>The following is the use of the hook:</p>
          <Source
            dark
            code={`
import { localize } from '@hakit/core';
export function MyComponent() {
    return <>{localize('component.calendar.entity_component._.name')}</>;
}
            `}
          />

          <p>
            The following would return you the translations set by default. This will fetch the translations based on your home assistant
            language setting and return an object with key/value pairs. The localize function provides additional functionality to
            find/replace values in the translations.
          </p>
          <Source
            dark
            code={`
import { localize } from '@hakit/core';
export function MyComponent() {
    const translations = useTranslations();
    return <>{translations['component.calendar.entity_component._.name']}</>;
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
  return <>{localize('component.calendar.entity_component._.name', {
    search: '{state}',
    replace: calendar.state,
  })}</>;
}
            `}
          />
          <h3>Additional translations</h3>
          <p>
            There's a set of defaults already retrieved and available, however there's other categories available which you can pass through
            to the HassConnect options:
          </p>
          <Source
            dark
            code={`
<HassConnect hassUrl={'http://localhost:8123'} options={{
  translations: ['config'] // typescript will help you with the available options
}}>
  <MyComponent />
</HassConnect>
            `}
          />
        </>
      ),
      description: {
        component: `A hook/helper that will retrieve available translations for your current language which are automatically retrieved from your Home Assistant instance.`,
      },
    },
  },
} satisfies Meta;

export type Story = StoryObj;
export const Docs: Story = {
  args: {},
};
