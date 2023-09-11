import { HassServices } from 'home-assistant-js-websocket';
import _ from 'lodash';
import { REMAPPED_TYPES } from './constants';

type Selector = {
  select?: {
    options?: {
      value: string;
    }[] | string[];
  }
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
    const options = selector?.select?.options;
    if (typeof options === 'undefined') return '';
    return options.map(option => `'${typeof option === 'string' ? option : option.value}'`).join(' | ');
  }
  return 'object';
}

function sanitizeString(str: string | boolean | number): string {
  return `${str}`.replace(/"/g, "'").replace(/[\n\r]+/g, ' ');
}

export const generateServiceTypes = (input: HassServices, whitelist: string[] = [], blacklist: string[] = []) => {
  const interfaces = Object.entries(input).map(([domain, services]) => {
    const camelDomain = _.camelCase(domain);
    if (blacklist.length > 0 && (blacklist.includes(camelDomain) || blacklist.includes(domain))) return '';
    if (whitelist.length > 0 && (!whitelist.includes(camelDomain) || !whitelist.includes(domain))) return '';
    const domainServices = Object.entries(services).map(([service, { fields, description }]) => {
      const camelService = _.camelCase(service);
      // the data passed to the ServiceFunction<object>
      const data = Object.entries(fields).map(([field, { selector, example, description, ...rest }]) => {
        // @ts-expect-error - this does exist, types are wrong in homeassistant
        const required = rest.required ?? false;
        // some fields come back as number[] but we know these should be something specific, these are hard coded above
        const type = field in REMAPPED_TYPES ? REMAPPED_TYPES[field] : resolveSelectorType(selector as Selector);
        const exampleUsage = example ? ` @example ${example}` : '';
        return `// ${sanitizeString(`${description}${exampleUsage}`)}\n${field}${required ? '' : '?'}: ${type};`;
      });
      // the data passed to the ServiceFunction<object>
      const serviceData = `${Object.keys(fields).length === 0 ? 'object' : `{${data.join('\n')}}`}`;
      return `// ${sanitizeString(description)}
        ${camelService}: ServiceFunction<T, ${serviceData}>;
      `;
    }).join('')
    const result = `${camelDomain}: {
        ${domainServices}
      }
    `;
    return result;
  });
  return interfaces.join('');
}
