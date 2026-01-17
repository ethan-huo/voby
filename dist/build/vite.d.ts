import type { Plugin } from 'vite';
export type Options = {
    hmr?: {
        enabled: boolean;
        filter?: RegExp;
    };
};
export declare function voby(options?: Options): Plugin;
//# sourceMappingURL=vite.d.ts.map