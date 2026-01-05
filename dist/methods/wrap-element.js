/* IMPORT */
import { SYMBOL_UNTRACKED_UNWRAPPED } from '../constants';
/* MAIN */
export const wrapElement = (element) => {
    ;
    element[SYMBOL_UNTRACKED_UNWRAPPED] = true;
    return element;
};
//# sourceMappingURL=wrap-element.js.map