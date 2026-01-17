const DEFAULT_HMR_FILTER = /\.(jsx|tsx)$/;
const hmrDefaultExportRe = /^export\s+default\s+(_?[A-Z][a-zA-Z0-9$_-]*)\s*(;|$)/m;
const hmrNamedExportRe = /^export\s+{([^}]+)}/gm;
const hmrNamedExportSingleRe = /^\s*(_?[A-Z][a-zA-Z0-9$_-]*)\s*$/;
const hmrNamedExportAliasedRe = /^\s*([a-zA-Z$_][a-zA-Z0-9$_]*)\s+as\s+(_?[A-Z][a-zA-Z0-9$_-]*)\s*$/;
const hmrNamedInlineExportRe = /^export\s+((?:function|const)\s+(_?[A-Z][a-zA-Z0-9$_-]*))/gm;
export function voby(options = {}) {
    const hmrEnabled = !!options.hmr?.enabled;
    const hmrFilter = options.hmr?.filter || DEFAULT_HMR_FILTER;
    return {
        name: 'voby',
        config() {
            return {
                esbuild: {
                    jsx: 'automatic',
                    jsxImportSource: 'voby',
                },
            };
        },
        transform: {
            // Hook filter for Vite 6.3.0+ / Rollup 4.38.0+ performance optimization
            filter: hmrEnabled ? { id: hmrFilter } : undefined,
            handler(code, id) {
                if (!hmrEnabled)
                    return;
                if (!hmrFilter.test(id))
                    return;
                const exports = [];
                code = code.replace(hmrDefaultExportRe, (_, $1, $2) => {
                    return `export default $$hmr(import.meta.hot?.accept?.bind(import.meta.hot), ${$1})${$2}`;
                });
                code = code.replace(hmrNamedInlineExportRe, (_, $1, $2) => {
                    exports.push(`${$2}.__hmr_as__ = "${$2}";\n` +
                        `const $$hmr_${$2} = $$hmr(import.meta.hot?.accept?.bind(import.meta.hot), ${$2});\n` +
                        `export {$$hmr_${$2} as ${$2}};`);
                    return $1;
                });
                code = code.replace(hmrNamedExportRe, (_, $1) => {
                    const parts = $1.split(',').filter((part) => {
                        const matchSingle = part.match(hmrNamedExportSingleRe);
                        const matchAliased = part.match(hmrNamedExportAliasedRe);
                        if (matchSingle) {
                            const name = matchSingle[1];
                            exports.push(`${name}.__hmr_as__ = "${name}";\n` +
                                `const $$hmr_${name} = $$hmr(import.meta.hot?.accept?.bind(import.meta.hot), ${name});\n` +
                                `export {$$hmr_${name} as ${name}};`);
                            return false;
                        }
                        if (matchAliased) {
                            const name = matchAliased[1];
                            const alias = matchAliased[2];
                            exports.push(`${name}.__hmr_as__ = "${alias}";\n` +
                                `const $$hmr_${name} = $$hmr(import.meta.hot?.accept?.bind(import.meta.hot), ${name});\n` +
                                `export {$$hmr_${name} as ${alias}};`);
                            return false;
                        }
                        return true;
                    });
                    return `export {${parts.join(',')}}`;
                });
                if (exports.length) {
                    // Inject hmr import and exports
                    code = `import { hmr as $$hmr } from 'voby';\n${code}\n${exports.join('\n')}`;
                }
                return code;
            },
        },
    };
}
//# sourceMappingURL=vite.js.map