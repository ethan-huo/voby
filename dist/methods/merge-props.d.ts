import type { Props, Ref } from '../types';
type AnyProps = Props;
type PropsGetter<P extends AnyProps> = (props: P) => P;
type InputProps<P extends AnyProps = AnyProps> = P | PropsGetter<P> | undefined;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type Simplify<T> = {
    [K in keyof T]: T[K];
} & {};
type ResolveInput<P> = P extends PropsGetter<infer R> ? R : P extends undefined ? {} : P;
type MergeResult<T extends readonly unknown[]> = Simplify<UnionToIntersection<ResolveInput<T[number]>>>;
declare function mergeProps<T extends readonly unknown[]>(...props: T): MergeResult<T>;
declare function mergeProps(a?: InputProps, b?: InputProps, c?: InputProps, d?: InputProps, e?: InputProps): Props;
declare function mergePropsN<T extends readonly unknown[]>(props: T): MergeResult<T>;
declare function mergePropsN(props: ReadonlyArray<InputProps>): Props;
declare const mergeRefs: <T>(ourRef: null | undefined | Ref<T> | (null | undefined | Ref<T>)[], theirRef: null | undefined | Ref<T> | (null | undefined | Ref<T>)[]) => null | undefined | Ref<T> | Ref<T>[];
export { mergeProps, mergePropsN, mergeRefs };
//# sourceMappingURL=merge-props.d.ts.map