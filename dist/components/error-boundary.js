/* IMPORT */
import { untrack } from '../methods/untrack';
import { tryCatch } from '../oby';
import { isFunction } from '../utils/lang';
/* MAIN */
export const ErrorBoundary = ({ fallback, children, }) => {
    return tryCatch(children, (props) => untrack(() => (isFunction(fallback) ? fallback(props) : fallback)));
};
//# sourceMappingURL=error-boundary.js.map