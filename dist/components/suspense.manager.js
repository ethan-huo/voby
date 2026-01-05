/* IMPORT */
import { SuspenseContext } from '../components/suspense.context';
import { useCleanup } from '../hooks/use-cleanup';
/* MAIN */
class SuspenseManager {
    /* VARIABLES */
    suspenses = new Map();
    /* API */
    change = (suspense, nr) => {
        const counter = this.suspenses.get(suspense) || 0;
        const counterNext = Math.max(0, counter + nr);
        if (counter === counterNext)
            return;
        if (counterNext) {
            this.suspenses.set(suspense, counterNext);
        }
        else {
            this.suspenses.delete(suspense);
        }
        if (nr > 0) {
            suspense.increment(nr);
        }
        else {
            suspense.decrement(nr);
        }
    };
    suspend = () => {
        const suspense = SuspenseContext.get();
        if (!suspense)
            return;
        this.change(suspense, 1);
        useCleanup(() => {
            this.change(suspense, -1);
        });
    };
    unsuspend = () => {
        this.suspenses.forEach((counter, suspense) => {
            this.change(suspense, -counter);
        });
    };
}
/* EXPORT */
export { SuspenseManager };
//# sourceMappingURL=suspense.manager.js.map