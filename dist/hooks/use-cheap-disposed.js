/* IMPORT */
import { useCleanup } from '../hooks';
/* MAIN */
export const useCheapDisposed = () => {
    let disposed = false;
    const get = () => disposed;
    const set = () => (disposed = true);
    useCleanup(set);
    return get;
};
//# sourceMappingURL=use-cheap-disposed.js.map