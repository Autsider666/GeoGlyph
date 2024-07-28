export type NamedDistinct<T, DistinctName> = T & { readonly __TYPE__: DistinctName };
export type Distinct<T> = T & { readonly __type: unique symbol };