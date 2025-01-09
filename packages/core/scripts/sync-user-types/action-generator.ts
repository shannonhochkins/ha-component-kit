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

interface ActionTypeOptions {
  domainWhitelist?: string[];
  domainBlacklist?: string[];
  serviceWhitelist?: string[];
  serviceBlacklist?: string[];
}

export const generateActionTypes = (input: HassServices, {
  domainWhitelist = [],
  domainBlacklist = [],
  serviceWhitelist = [],
  serviceBlacklist = [],
}: ActionTypeOptions) => {
  const interfaces = Object.entries(input).map(([domain, actions]) => {
    const camelDomain = _.camelCase(domain);
    if (domainBlacklist.length > 0 && (domainBlacklist.includes(camelDomain) || domainBlacklist.includes(domain))) return '';
    if (domainWhitelist.length > 0 && (!domainWhitelist.includes(camelDomain) || !domainWhitelist.includes(domain))) return '';
    const domainActions = Object.entries(actions).map(([action, { fields, description }]) => {
      const camelAction = _.camelCase(action);
      if (serviceBlacklist.length > 0 && (serviceBlacklist.includes(camelAction) || serviceBlacklist.includes(action))) return '';
      if (serviceWhitelist.length > 0 && (!serviceWhitelist.includes(camelAction) || !serviceWhitelist.includes(action))) return '';
      // the data passed to the ServiceFunction<object>
      const data = Object.entries(fields).map(([field, { selector, example, description, ...rest }]) => {
        const required = rest.required ?? false;
        const remapByDomainActionField = `${domain}.${action}.${field}`;
        const remapByActionField = `${action}.${field}`;
        const remapByField = field;
        const domainActionFieldOverride = remapByDomainActionField in REMAPPED_TYPES ? REMAPPED_TYPES[remapByDomainActionField] : undefined;
        const actionFieldOverride = remapByActionField in REMAPPED_TYPES ? REMAPPED_TYPES[remapByActionField] : undefined;
        const fieldOverride = remapByField in REMAPPED_TYPES ? REMAPPED_TYPES[remapByField] : undefined;
        // some fields come back as an incorrect type but we know these should be something specific, these are hard coded in the REMAPPED_TYPES constant
        const type = domainActionFieldOverride || actionFieldOverride || fieldOverride || resolveSelectorType(selector as Selector);
        const exampleUsage = example ? ` @example ${example}` : '';
        return `// ${sanitizeString(`${description}${exampleUsage}`)}\n${field}${required ? '' : '?'}: ${type};`;
      });
      // the data passed to the ServiceFunction<object>
      const actionData = `${Object.keys(fields).length === 0 ? 'object' : `{${data.join('\n')}}`}`;
      return `// ${sanitizeString(description)}
        ${camelAction}: ServiceFunction<object, T, ${actionData}>;
      `;
    }).join('')
    const result = `${camelDomain}: {
        ${domainActions}
      }
    `;
    return result;
  });
  return interfaces.join('');
}