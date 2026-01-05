/* IMPORT */
import { useRoot } from '../hooks/use-root';
import { useUntracked } from '../hooks/use-untracked';
import { setChild } from '../utils/setters';
/* MAIN */
export const render = (child, parent) => {
    if (!parent || !(parent instanceof HTMLElement))
        throw new Error('Invalid parent node');
    parent.textContent = '';
    return useRoot((dispose) => {
        setChild(parent, useUntracked(child));
        return () => {
            dispose();
            parent.textContent = '';
        };
    });
};
//# sourceMappingURL=render.js.map