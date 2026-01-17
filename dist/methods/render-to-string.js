/* IMPORT */
import { Portal } from '../components/portal';
import { SuspenseCollector } from '../components/suspense.collector';
import { useEffect } from '../hooks/use-effect';
import { useRoot } from '../hooks/use-root';
import { get } from '../methods/get';
/* MAIN */
//TODO: Implement this properly, without relying on JSDOM or stuff like that
export const renderToString = (child) => {
    return new Promise((resolve) => {
        useRoot((dispose) => {
            get(SuspenseCollector.wrap((suspenses) => {
                const { portal } = Portal({ children: child }).metadata;
                useEffect(() => {
                    if (suspenses.active())
                        return;
                    resolve(portal.innerHTML);
                    dispose();
                }, { suspense: false });
            }));
        });
    });
};
//# sourceMappingURL=render-to-string.js.map