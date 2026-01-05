/* IMPORT */
import { isServer } from './methods/is-server';
/* MAIN */
const initSingleton = () => {
    if (isServer())
        return;
    const isLoaded = !!globalThis.VOBY;
    if (isLoaded) {
        throw new Error('Voby has already been loaded');
    }
    globalThis.VOBY = true;
};
/* EXPORT */
export { initSingleton };
//# sourceMappingURL=singleton.js.map