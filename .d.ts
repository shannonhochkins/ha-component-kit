import { Entries } from 'type-fest';

declare global {
  interface ObjectConstructor {
    entries<T extends object>(o: T): Entries<T>
  }
  interface ProxyConstructor {
    new <TSource extends object, TTarget extends object>(target: TSource, handler: ProxyHandler<TSource>): TTarget;
  }
}