import fs from 'fs';
import path from 'path';
import input from './services.json';

const toCamelCase = (str) => {
    return str.toLowerCase().replace(/(_\w)/g, (m) => m[1].toUpperCase());
}

const resolveSelectorType = (selector) => {
    console.log('selector', selector);
    if (!selector) return 'object';
    const keys = Object.keys(selector);
    if (keys.includes('number')) return 'number';
    if (keys.includes('object')) return 'object';
    if (keys.includes('text') || keys.includes('entity')) return 'string';
    if (keys.includes('boolean')) return 'boolean';
    if (keys.includes('select')) {
        return selector.select.options.map(option => `'${option.value}'`).join(' | ');
    }
    return 'object';
}

const generateInterface = () => {
    let _interface = "type HassServiceTarget = {\n    entity_id?: string | string[];\n    device_id?: string | string[];\n    area_id?: string | string[];\n};\n\n";
    let api = `{`;
    const services = Object.entries(input).map(([domain, services]) => {
      const camelDomain = toCamelCase(domain);
      api += `${camelDomain}: {`;
      const result = `
        ${camelDomain}: {
          ${Object.entries(services).map(([service, { fields, description }]) => {
            const camelService = toCamelCase(service);
            const serviceData = Object.entries(fields).map(([field, { selector, required, description }]) => {
              const type = resolveSelectorType(selector);
              return `// ${description}\n${field}${required ? '' : '?'}: ${type};`;
            });
            api += `${camelService} : (target: HassServiceTarget, serviceData: ${Object.keys(fields).length === 0 ? 'object' : `{${serviceData.join('\n')}}`} ) => {
              return callService({
                domain: '${domain}',
                service: '${service}',
                target,
                serviceData,
              });
            },`
            return `
              // ${description}
              ${camelService}: (entity: HassServiceTarget, serviceData: ${Object.keys(fields).length === 0 ? 'object' : `{${serviceData.join('\n')}}`} ) => void;
            `;
          }).join('\n')}
        }
      `;
      api += '},';
      return result;
    });
    _interface += `export interface SupportedServices {
      ${services.join('')}
    }`;
    api += `}`;
    return `
    // this is an auto generated file, do not change this manually
    import type { HassServiceTarget } from "home-assistant-js-websocket";
    import { useHass } from '../useHass';
    export function useApi() {
      const { callService } = useHass();
      return ${api};
    }`;
}

const main = () => {
    const result = generateInterface();
    fs.writeFileSync('./src/hooks/useApi/index.ts', result);
    console.log('Interfaces successfully generated!');
}

main();