type BuildTuple<N extends number, T, L extends T[] = []> =
    number extends N // <-- is the type "number"?
        ? T[] // <-- if type is "number", just return a regular array type
        : L['length'] extends N // <-- does the type of `L`'s ".length" property match that of N?
            ? L // <-- if L length matches N, we've reached the maximum length for the tuple and can return the type
            : BuildTuple<N, T, [T, ...L]>; // <-- add 1 more T to the L tuple

export type Tuple<N extends number, T> = [...BuildTuple<N, T>]; // <-- wrapping `BuildTuple` in a spread is necessary because ts actually cant tell that the above is an array for some reason

export type MinTuple<N extends number, T> = [...BuildTuple<N, T>, ...T[]];