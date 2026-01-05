/* HELPERS */
const IS_BROWSER = !!globalThis.CDATASection?.toString?.().match(/^\s*function\s+CDATASection\s*\(\s*\)\s*\{\s*\[native code\]\s*\}\s*$/);
/* MAIN */
const isServer = () => {
    return !IS_BROWSER;
};
/* EXPORT */
export { isServer };
//# sourceMappingURL=is-server.js.map