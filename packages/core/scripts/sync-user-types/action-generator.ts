import { HassService, HassServices } from 'home-assistant-js-websocket';
import _ from 'lodash';
import { REMAPPED_TYPES } from './constants';

type SelectorValues = string | number | boolean | null;
type SelectorOption = {
  [key: string]: SelectorValues;
}

type Selector = {
  
  select?: {
    [key: string]: object | {
      value: string;
    }[] | string[];
  }
  number?: SelectorOption;
  object?: SelectorOption;
  text?: SelectorOption;
  entity?: SelectorOption;
  boolean?: SelectorOption;
  datetime?: SelectorOption;
  duration?: SelectorOption;
};

const resolveSelectorType = (selector: Selector) => {
  if (!selector) return 'object';
  // there only ever seems to be one key under the selector object
  const keys = Object.keys(selector);
  if (keys.includes('number')) return 'number';
  if (keys.includes('object')) return 'object';
  if (keys.includes('duration')) return `{
    hours?: number;
    days?: number;
    minutes?: number;
    seconds?: number;
  }`;
  const stringTypes = [
    'text',
    'entity',
    'datetime',
    'time',
    'date',
    'addon',
    'backup_location',
    'icon',
    'conversation_agent',
    'device',
    'theme',
  ];
  const isStringType = stringTypes.some(type => keys.includes(type));
  if (isStringType) return 'string';
  if (keys.includes('boolean')) return 'boolean';
  if (keys.includes('select')) {
    const options = selector?.select?.options;
    if (!_.isArray(options) || options.length === 0) return 'unknown';
    return `${options.map(option => `'${typeof option === 'string' ? option : option.value}'`).join(' | ')}`;
  }
  // unknown types
  return 'unknown';
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
      function processFields(fields: HassService['fields']): string[] {
        return Object.entries(fields).map(([field, { selector, example, description, ...rest }]) => {
          const required = rest.required ?? false;
          const remapByDomainActionField = `${domain}.${action}.${field}`;
          const remapByActionField = `${action}.${field}`;
          const remapByField = field;
          const domainActionFieldOverride = remapByDomainActionField in REMAPPED_TYPES ? REMAPPED_TYPES[remapByDomainActionField] : undefined;
          const actionFieldOverride = remapByActionField in REMAPPED_TYPES ? REMAPPED_TYPES[remapByActionField] : undefined;
          const fieldOverride = remapByField in REMAPPED_TYPES ? REMAPPED_TYPES[remapByField] : undefined;
          const _selector = selector as Selector;
          const overrides = domainActionFieldOverride || actionFieldOverride || fieldOverride;
          // some fields come back as an incorrect type but we know these should be something specific, these are hard coded in the REMAPPED_TYPES constant
          const type = typeof overrides === 'string' ? overrides : resolveSelectorType(_selector);
          let constraints = '';
          if (_.isObject(selector)) {
            const ignoredKeys = ['select', 'entity', 'theme', 'constant', 'text', 'device'];
            constraints = Object.entries(_selector || {})
              .filter(([_key, value]) => _key && _.isObject(value) && !ignoredKeys.includes(_key))
              .map(([key, value]) => ` ${key}: ${Object.entries(value || {} as object).map(([key, value]) => `${key}: ${value}`).join(', ')}`).join(', ');
            constraints = constraints ? ` @constraints ${constraints}` : '';
          }
          const exampleUsage = example ? ` @example ${example}` : '';
          const isAdvancedFields = field === 'advanced_fields';
          const comment = `${description ?? ''}${exampleUsage ?? ''}${constraints}`;
          return isAdvancedFields && 'fields' in rest ? processFields(rest.fields as HassService['fields']).join('\n') : `//${comment ? sanitizeString(` ${comment}`) : ''}\n${field}${required ? '' : '?'}: ${type};`;
        });
      }     
      // the data passed to the ServiceFunction<object>
      const data = processFields(fields);
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