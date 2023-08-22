import { HassServices, HassService } from 'home-assistant-js-websocket';
import _ from 'lodash';

type Selector = {
  select?: {
    options?: {
      value: string;
    }[] | string;
  }
};
type Field = HassService['fields'] & {
  [field_name: string]: {
    name?: string;
    description: string;
    example: string | boolean | number;
    selector?: Selector;
  };
} & {
  required: boolean;
}

const REMAPPED_TYPES: Record<string, string> = {
  hs_color: `[number, number]`,
  rgb_color: `[number, number, number]`,
  rgbw_color: `[number, number, number, number]`,
  rgbww_color: `[number, number, number, number, number]`,
};

const resolveSelectorType = (selector: Selector) => {
  if (!selector) return 'object';
  // there only ever seems to be one key under the selector object
  const keys = Object.keys(selector);
  if (keys.includes('number')) return 'number';
  if (keys.includes('object')) return 'object';
  if (keys.includes('text') || keys.includes('entity')) return 'string';
  if (keys.includes('boolean')) return 'boolean';
  if (keys.includes('select')) {
    // @ts-expect-error - fix types later
    return selector?.select?.options.map(option => `'${option.value || option}'`).join(' | ');
  }
  return 'object';
}



export const generateServiceTypes = (input: HassServices, whitelist: string[] = []) => {
  const interfaces = Object.entries(input).map(([domain, services]) => {
    const camelDomain = _.camelCase(domain);
    if (whitelist.length > 0 && (!whitelist.includes(camelDomain) || !whitelist.includes(domain))) return '';
    const result = `${camelDomain}: {
          ${Object.entries<HassService>(services).map(([service, { fields, description }]) => {
      const camelService = _.camelCase(service);
      const data = Object.entries<Field>(fields as unknown as { [key: string]: Field }).map(([field, { selector, example, required, description }]) => {
        const type = field in REMAPPED_TYPES ? REMAPPED_TYPES[field] : resolveSelectorType(selector as Selector);
        const exampleUsage = example ? ` @example ${`${example}`.replace(/"/g, "'").replace(/[\n\r]+/g, ' ')}` : '';
        return `// ${description}${exampleUsage}\n${field}${required ? '' : '?'}: ${type};`;
      });
      const serviceData = `${Object.keys(fields).length === 0 ? 'object' : `{${data.join('\n')}}`}`;

      return `// ${description}
              ${camelService}: ServiceFunction<T, ${serviceData}>;
            `;
    }).join('')}
        }
      `;
    return result;
  });
  return interfaces.join('');
}
