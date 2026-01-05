/* IMPORT */
import { useEffect } from '../hooks/use-effect';
/* HELPERS */
const options = {
    sync: 'init',
};
/* MAIN */
// This function exists for convenience, and to avoid creating unnecessary options objects
export const useRenderEffect = (fn) => {
    return useEffect(fn, options);
};
//# sourceMappingURL=use-render-effect.js.map