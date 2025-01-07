import { Project, SyntaxKind, InterfaceDeclaration, TypeAliasDeclaration, SourceFile, Symbol, PropertySignature, TypeNode, SymbolFlags, Type }from 'ts-morph';
import { readdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { format } from 'prettier';
const project = new Project();

const REPOSITORY_URL = 'https://github.com/home-assistant/frontend.git';
const OUTPUT_PATH = './.ha-repo-cache';
const SCAN_PATH = `${OUTPUT_PATH}/src/data`;
const OUTPUT_FILE = './src/types/autogenerated-types-by-domain.ts';


const genericTypesToMatch = ['LightColor', 'LightColorMode'];

const addedAlias: string[] = [];


const cloneRepo = async () => {  
    // Check if the directory already exists
  if (existsSync(OUTPUT_PATH)) {
    console.info(`Directory ${OUTPUT_PATH} already exists. Skipping git clone.`);
    return;
  }
  const { simpleGit, CleanOptions } = await import('simple-git');
  const git = simpleGit().clean(CleanOptions.FORCE);
  console.info('cloning home assistant repository');
  await git.clone(REPOSITORY_URL, OUTPUT_PATH);
};

const getTSFiles = (): string[] => {  
  const entries = readdirSync(SCAN_PATH, { withFileTypes: true });
  const filePaths = entries.map((entry) =>
    join(SCAN_PATH, entry.name)
  );

  const tsFiles = filePaths.filter((filePath) =>
    filePath.endsWith('.ts')
  );

  return tsFiles;
};

const extractConstants = (sourceFile: SourceFile, keyword: string) => {
  const allVariableStatements = sourceFile.getVariableStatements();
  for (const statement of allVariableStatements) {
    const declarations = statement.getDeclarations();
    for (const declaration of declarations) {
      if (declaration.getName() === keyword) {
        return declaration.getText();
      }
    }
  }
  return null;
};


const exploreTypeNode = (typeNode: TypeNode | TypeAliasDeclaration) => {
  let output = '';
  const typeText = typeNode.getText();
  // Handle 'typeof' cases
  if (typeText.includes('typeof')) {
    const match = typeText.match(/typeof (\w+)/);
    if (match) {
      const keyword = match[1];
      const sourceFile = typeNode.getSourceFile();
      const constantText = extractConstants(sourceFile, keyword);
      if (constantText) {
        output += `export const ${constantText}\n`;
      }
    }
  }
  // Handle object types and other complex types
  typeNode.forEachChild(child => {
    child.forEachDescendantAsArray().forEach(descendant => {
      const decKind = descendant.getKind();
      if (decKind === SyntaxKind.TypeReference || decKind === SyntaxKind.TypeLiteral) {
        output += exploreTypeNode(child as TypeNode);
      }
    });
  });
  return output;
};

const exploreProperty = (prop: PropertySignature): string => {
  const typeNode = prop.getTypeNode();
  return typeNode ? exploreTypeNode(typeNode) : '';
};

const exploreInterface = (interfaceDecl: InterfaceDeclaration) => {
  return interfaceDecl.getProperties().map(prop => exploreProperty(prop)).filter(x => !!x);
};

const exploreTypeAlias = (typeAliasDecl: TypeAliasDeclaration): string[] => {
  const output: string[] = [];
  const sourceFile = typeAliasDecl.getSourceFile();
  typeAliasDecl.forEachDescendantAsArray().forEach(descendant => {
    const type = descendant.getType();
    if (type.isObject()) {
      return type.getProperties().forEach(prop => {
        const propType = project.getTypeChecker().getTypeOfSymbolAtLocation(prop, prop.getValueDeclarationOrThrow());
        const aliasSymbol = propType.getAliasSymbol();
        if (aliasSymbol) {
          const name = aliasSymbol.getName();
          if (addedAlias.includes(name)) return;
          const typeAlias = sourceFile.getTypeAlias(name);
          if (typeAlias) {
            output.push(...[typeAlias.getText(), exploreTypeNode(typeAlias)]);
            addedAlias.push(name);
          }
        } else {
          const typeDeclarationText = descendant.getText();
          const lines = typeDeclarationText.split(";");
          lines.forEach(line => {
            const parts = line.split(":");
            if (parts.length === 2) {
              const propType = parts[1].trim();
              if (addedAlias.includes(propType)) return;
              const typeAlias = sourceFile.getTypeAlias(propType);
              if (typeAlias) {
                output.push(...[typeAlias.getText(), exploreTypeNode(typeAlias)]);
                addedAlias.push(propType);
              }
            }
          });
        }
      });
    }
  });
  return output;
}


const generateTypeIdentifier = (type: Type): string => {
  return type.getText().split('.').pop() ?? '';
};

const findRelatedTypes = (interfaceDecl: InterfaceDeclaration | TypeAliasDeclaration): Set<Symbol> => {
  const relatedTypes = new Set<Symbol>();
  const exploredTypes = new Set<string>();


  const exploreType = (type: Type) => {
    // Skip types that have already been explored
    const id = generateTypeIdentifier(type);
    // Explore type queries
    if (exploredTypes.has(id)) {
      return;
    }
    if (addedAlias.includes(id)) {
      return;
    }
    exploredTypes.add(id);
    const sourceFile = type.getSymbol()?.getDeclarations()?.[0]?.getSourceFile();
    if (sourceFile && !sourceFile.getFilePath().includes(SCAN_PATH.split(OUTPUT_PATH).pop() as string)) {
      return;
    }
    const symbolFlags = type.getSymbol()?.getFlags();
     // Skip enum members
    if (typeof symbolFlags !== 'undefined' && symbolFlags & SymbolFlags.EnumMember) {
      return;
    }

    const symbol = type.getSymbol();
    const aliasSymbol = type.getAliasSymbol();
    if (aliasSymbol) {
      // This type is an alias. We can check its name.
      const aliasName = aliasSymbol.getName();
      if (!exploredTypes.has(aliasName)) {
        relatedTypes.add(aliasSymbol)
      }
    } 
    if (symbol) {
      relatedTypes.add(symbol);
    }
    // Handle union types
    if (type.isUnion()) {
      type.getUnionTypes().forEach(exploreType);
    }

    // Handle intersection types
    if (type.isIntersection()) {
      type.getIntersectionTypes().forEach(exploreType);
    }
    // Handle array types
    if (type.isArray()) {
      const arrayElementType = type.getArrayElementType();
      if (arrayElementType) {
        exploreType(arrayElementType);
      }
    }
    
    if (type.isEnum()) {
      relatedTypes.add(type.getSymbolOrThrow());
    }

    if (type.isTypeParameter()) {
      const constraint = type.getConstraint();
      if (constraint) {
        exploreType(constraint);
      }
    }
    if (type.isIntersection()) {
      type.getIntersectionTypes().forEach((intersectType) => {
        exploreType(intersectType);
      });
    }

    if (type.isObject()) {
      const objectProps = type.getApparentProperties();
      objectProps.forEach(objectProp => {
        const objectPropType = objectProp.getValueDeclaration()?.getType();
        if (objectPropType) {
          if (objectPropType.isArray()) {
            const arrayElementType = objectPropType.getArrayElementType();
            if (arrayElementType) {
              exploreType(arrayElementType);
            }
          } else {
            exploreType(objectPropType);
          }
        }
      });
    }
  };

  if (interfaceDecl instanceof InterfaceDeclaration) {
    interfaceDecl.getProperties().forEach(prop => {
      const type = prop.getType();
      exploreType(type);
    });
  }
  if (interfaceDecl instanceof TypeAliasDeclaration) {
    interfaceDecl.forEachDescendantAsArray().forEach(descendant => {
      exploreType(descendant.getType());
    });
    exploreType(interfaceDecl.getType());
  }

  return relatedTypes;
};

const generateTypeScriptCode = (declaration: InterfaceDeclaration | TypeAliasDeclaration, relatedTypes: Set<Symbol>) => {
  let code = declaration.getText();
  relatedTypes.forEach(typeSymbol => {
    const declarations = typeSymbol.getDeclarations();
    declarations.forEach(declaration => {
      const text = declaration.getText();
      // skip home-assistant-js-websocket types
      if (text.includes('home-assistant-js-websocket')) return;
      const name = declaration.getSymbol()?.getName();
      if (name && name !== '__type') {
        code += '\n\n' + text;
      }
    });
  });
  return code;
};

// Step 3 and 4: Parse TypeScript files and extract interfaces
const extractMatches = async (tsFilePaths: string[]): Promise<string> => {
  const constants: string[][] = [];
  let output = ``;
  // add the files to the project
  project.addSourceFilesAtPaths(tsFilePaths);
  project.resolveSourceFileDependencies();
  // get the source files
  const sourceFiles = project.getSourceFiles();
  // loop over each file to determine if it's viable
  sourceFiles.forEach((sourceFile) => {

    genericTypesToMatch.forEach(type => {
      const typeAlias = sourceFile.getTypeAlias(type);
      const enumAlias = sourceFile.getEnum(type);
      if (typeAlias) {
        output += typeAlias.getText();
        output += exploreTypeNode(typeAlias);
        addedAlias.push(type);
      }
      if (enumAlias) {
        // hack to get around the const enums so we can use this as a constant
        if (type === 'LightColorMode') {
          const properties = enumAlias.getMembers().map(x => x.getText().split(' = '));
          output += `export const LIGHT_COLOR_MODES = {
            ${properties.map(x => `"${x[0]}": ${x[1]}`).join(',\n')}
          };`;
          output += `export type LightColorMode = (typeof LIGHT_COLOR_MODES)[keyof typeof LIGHT_COLOR_MODES];`
        }
        addedAlias.push(type);
      }
    });
    const interfaces = sourceFile.getInterfaces();
    interfaces.forEach((interfaceDeclaration) => {
      constants.push(exploreInterface(interfaceDeclaration));
      const baseTypes = interfaceDeclaration.getType().getBaseTypes();
      if (baseTypes.some(baseType => baseType.getText().includes('HassEntityBase'))) {
        console.info('Found Match:', interfaceDeclaration.getName());
        const relatedTypes = findRelatedTypes(interfaceDeclaration);
        const code = generateTypeScriptCode(interfaceDeclaration, relatedTypes);
        output += code.replace(/export interface/g, 'interface').replace(/interface /g, 'export interface ');
      }
    });
    const types = sourceFile.getTypeAliases();

    types.forEach((typeAliasDeclaration) => {
      if (typeAliasDeclaration.getText().includes('HassEntityBase')) {
        console.info('Found Match:', typeAliasDeclaration.getName());
        constants.push(exploreTypeAlias(typeAliasDeclaration));
        const relatedTypes = findRelatedTypes(typeAliasDeclaration);
        const code = generateTypeScriptCode(typeAliasDeclaration, relatedTypes);
        const replaced = code.replace(/export type/g, 'type').replace(/type /g, 'export type ');
        const dec = code.match(/export type (\w+)/);
        if (dec && dec[0] && !output.includes(dec[0])) {
          output += replaced;
        }
      }
    });
  });
  // First, flatten the array
  const flattenedConstants = constants.flat();

  // Now, filter out the unique constants
  const uniqueConstants = [...new Set(flattenedConstants)];
  return `
  /* eslint-disable @typescript-eslint/no-explicit-any */
  // auto generated, do not manipulate, instead run the sync-ha-types script
  import { HassEntityBase, HassEntityAttributeBase } from 'home-assistant-js-websocket';
    ${uniqueConstants.join('\n')}
    ${output}
  `;
};

export const generateAttributeTypes = async () => {
  // Step 1: Clone the repository
  await cloneRepo();
  // Step 2: Get TypeScript files
  const tsFiles = getTSFiles();
  const code = await extractMatches(tsFiles);
  const formatted = await format(code, {
    parser: 'typescript',
  });
  writeFileSync(OUTPUT_FILE, formatted);
};


(async function runner() {
  await generateAttributeTypes();
}());