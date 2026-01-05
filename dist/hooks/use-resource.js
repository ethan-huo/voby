/* IMPORT */
import { SuspenseManager } from '../components/suspense.manager';
import { useCheapDisposed } from '../hooks/use-cheap-disposed';
import { useReadonly } from '../hooks/use-readonly';
import { useRenderEffect } from '../hooks/use-render-effect';
import { get } from '../methods/get';
import { $ } from '../methods/S';
import { assign, castError, isPromise } from '../utils/lang';
/* MAIN */
//TODO: Maybe port this to oby, as "from"
//TODO: Option for returning the resource as a store, where also the returned value gets wrapped in a store
//FIXME: SSR demo: toggling back and forth between /home and /loader is buggy, /loader gets loaded with no data, which is wrong
export const useResource = (fetcher) => {
    const pending = $(true);
    const error = $();
    const value = $();
    const latest = $();
    const { suspend, unsuspend } = new SuspenseManager();
    const resourcePending = {
        pending: true,
        get value() {
            return void suspend();
        },
        get latest() {
            return latest() ?? void suspend();
        },
    };
    const resourceRejected = {
        pending: false,
        get error() {
            return error();
        },
        get value() {
            throw error();
        },
        get latest() {
            throw error();
        },
    };
    const resourceResolved = {
        pending: false,
        get value() {
            return value();
        },
        get latest() {
            return value();
        },
    };
    const resourceFunction = {
        pending: () => pending(),
        error: () => error(),
        value: () => resource().value,
        latest: () => resource().latest,
    };
    const resource = $(resourcePending);
    useRenderEffect(() => {
        const disposed = useCheapDisposed();
        const onPending = () => {
            pending(true);
            error(undefined);
            value(undefined);
            resource(resourcePending);
        };
        const onResolve = (result) => {
            if (disposed())
                return;
            pending(false);
            error(undefined);
            value(() => result);
            latest(() => result);
            resource(resourceResolved);
        };
        const onReject = (exception) => {
            if (disposed())
                return;
            pending(false);
            error(castError(exception));
            value(undefined);
            latest(undefined);
            resource(resourceRejected);
        };
        const onFinally = () => {
            if (disposed())
                return;
            unsuspend();
        };
        const fetch = () => {
            try {
                const value = get(fetcher());
                if (isPromise(value)) {
                    onPending();
                    value.then(onResolve, onReject).finally(onFinally);
                }
                else {
                    onResolve(value);
                    onFinally();
                }
            }
            catch (error) {
                onReject(error);
                onFinally();
            }
        };
        fetch();
    });
    return assign(useReadonly(resource), resourceFunction);
};
//# sourceMappingURL=use-resource.js.map