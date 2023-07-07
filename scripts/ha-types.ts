import fs from 'fs';
import input from './services.json';
import _ from 'lodash';

const resolveSelectorType = (selector) => {
  console.log('selector', selector);
  if (!selector) return 'object';
  const keys = Object.keys(selector);
  if (keys.includes('number')) return 'number';
  if (keys.includes('object')) return 'object';
  if (keys.includes('text') || keys.includes('entity')) return 'string';
  if (keys.includes('boolean')) return 'boolean';
  if (keys.includes('select')) {
    return selector.select.options.map(option => `'${option.value || option}'`).join(' | ');
  }
  return 'object';
}

interface Field {
  selector: {
    [key: string]: {
      select?: {
        options: Array<{
          value: string;
          name: string;
        } | string>;
      };
    }
  }
  required: boolean;
  description: string;
}

const generateInterface = () => {
  const warning = `
  // this is an auto generated file, do not change this manually
  // see scripts/README.md for more information
  `;
  const interfaces = Object.entries(input).map(([domain, services]) => {
    const camelDomain = _.camelCase(domain);
    const result = `${camelDomain}: {
          ${Object.entries(services).map(([service, { fields, description }]) => {
      const camelService = _.camelCase(service);
      const data = Object.entries<Field>(fields).map(([field, { selector, required, description }]) => {
        const type = resolveSelectorType(selector);
        return `// ${description}\n${field}${required ? '' : '?'}: ${type};`;
      });
      const serviceData = `${Object.keys(fields).length === 0 ? 'object' : `{${data.join('\n')}}`}`;

      return `// ${description}
              ${camelService}: ServiceFunction<${serviceData}>;
            `;
    }).join('')}
        }
      `;
    return result;
  });
  return `
    ${warning}
    export type ServiceFunction<Data = object> = (
      entity: string,
      data?: Data
    ) => void;
    export type DomainName = Exclude<keyof SupportedServices, symbol>;
    
    export type SnakeToCamel<S extends string> = S extends \`\${infer P1}_\${infer P2}\${infer P3}\`
      ? \`\${P1}\${Uppercase<P2>}\${SnakeToCamel<P3>}\`
      : S;
    
    export type EntityToServices<E extends string> = E extends \`\${infer Prefix}.\${string}\`
      ? (SnakeToCamel<Prefix> extends keyof SupportedServices ? SupportedServices[SnakeToCamel<Prefix>] : never)
      : (E extends keyof SupportedServices ? SupportedServices[E] : never);
    
    export type ServiceData<E extends string, S extends keyof EntityToServices<E>> = EntityToServices<E>[S] extends ServiceFunction<infer Params> ? Params : never;
    
    export type DomainService<T extends DomainName> = Exclude<
      keyof SupportedServices[T],
      symbol | number
    >;
    export interface SupportedServices {
      ${interfaces.join('')}
    }`;
}

const main = () => {
  const services = generateInterface();
  fs.writeFileSync('./supported-services.ts', services);
  console.log('Interfaces successfully generated!');
}

main();