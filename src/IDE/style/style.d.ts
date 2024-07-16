// eslint-disable-next-line @typescript-eslint/no-unused-vars

declare module 'csstype' {
    interface Properties {

        // Allow any CSS Custom Properties
        [index: `--${string}`]: unknown;
    }
}
