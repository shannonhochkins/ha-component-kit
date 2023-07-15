import { Entries } from 'type-fest';

declare global {
  interface ObjectConstructor {
    entries<T extends object>(o: T): Entries<T>
  }
  interface ProxyConstructor {
    new <TSource extends object, TTarget extends object>(target: TSource, handler: ProxyHandler<TSource>): TTarget;
  }
}

declare module 'jsx-to-string' {
  type JSXToStringOptions = {
    displayName?: string;
    ignoreProps?: string[];
    ignoreTags?: string[];
    keyValueOverride?: Record<string, string>;
    spacing?: number;
    detectFunctions?: boolean;
  };

  type JSXToStringResult = {
    toString(): string;
  };

  export function jsxToString(jsxElement: JSX.Element, options?: JSXToStringOptions): JSXToStringResult;
}