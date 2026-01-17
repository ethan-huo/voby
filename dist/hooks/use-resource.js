/* IMPORT */
import { SuspenseManager } from '../components/suspense.manager';
import { useCheapDisposed } from '../hooks/use-cheap-disposed';
import { useReadonly } from '../hooks/use-readonly';
import { useRenderEffect } from '../hooks/use-render-effect';
import { get } from '../methods/get';
import { $ } from '../methods/S';
import { untrack } from '../methods/untrack';
import { assign, castError, isFunction, isPromise } from '../utils/lang';
export function useResource(pSource, pFetcher, pOptions) {
    let source;
    let fetcher;
    let options;
    if (typeof pFetcher === 'function') {
        source = pSource;
        fetcher = pFetcher;
        options = (pOptions || {});
    }
    else {
        source = true;
        fetcher = pSource;
        options = (pFetcher || {});
    }
    const pending = $(false);
    const error = $();
    const value = $();
    const latest = $();
    const hasInitialValue = 'initialValue' in options;
    if (hasInitialValue) {
        const initialValue = options.initialValue;
        value(() => initialValue);
        latest(() => initialValue);
    }
    const { suspend, unsuspend } = new SuspenseManager();
    const resourcePending = {
        pending: true,
        get value() {
            return value() ?? void suspend();
        },
        get latest() {
            const latestValue = latest();
            if (latestValue !== undefined)
                return latestValue;
            return value() ?? void suspend();
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
            return latest() ?? value();
        },
    };
    const resourceIdle = {
        pending: false,
        get value() {
            return value();
        },
        get latest() {
            return latest();
        },
    };
    const resourceFunction = {
        pending: () => pending(),
        error: () => error(),
        value: () => resource().value,
        latest: () => resource().latest,
    };
    const resource = $(hasInitialValue ? resourceResolved : resourceIdle);
    let disposed = () => false;
    let fetchId = 0;
    const setIdle = () => {
        pending(false);
        error(undefined);
        resource(value() === undefined ? resourceIdle : resourceResolved);
        unsuspend();
    };
    const setPending = (keepValue) => {
        pending(true);
        error(undefined);
        if (!keepValue)
            value(undefined);
        resource(resourcePending);
    };
    const setResolved = (result) => {
        if (disposed())
            return;
        pending(false);
        error(undefined);
        value(() => result);
        latest(() => result);
        resource(resourceResolved);
    };
    const setRejected = (exception) => {
        if (disposed())
            return;
        pending(false);
        error(castError(exception));
        value(undefined);
        resource(resourceRejected);
    };
    const finalize = (id) => {
        if (disposed())
            return;
        if (id !== fetchId)
            return;
        unsuspend();
    };
    const runFetch = (refetching = false, sourceOverride) => {
        const lookup = sourceOverride ?? get(source);
        const keepValue = value() !== undefined;
        const currentId = (fetchId += 1);
        setPending(keepValue);
        try {
            const result = untrack(() => fetcher(lookup, {
                value: value(),
                refetching,
            }));
            const resolved = get(result);
            if (isPromise(resolved)) {
                resolved
                    .then((value) => {
                    if (currentId !== fetchId)
                        return;
                    setResolved(value);
                })
                    .catch((error) => {
                    if (currentId !== fetchId)
                        return;
                    setRejected(error);
                })
                    .finally(() => finalize(currentId));
            }
            else {
                setResolved(resolved);
                finalize(currentId);
            }
        }
        catch (error) {
            setRejected(error);
            finalize(currentId);
        }
    };
    const mutate = (next) => {
        const prev = value();
        const resolved = isFunction(next)
            ? next(prev)
            : next;
        pending(false);
        error(undefined);
        if (resolved === undefined) {
            value(undefined);
            latest(undefined);
            resource(resourceIdle);
        }
        else {
            value(() => resolved);
            latest(() => resolved);
            resource(resourceResolved);
        }
        return resolved;
    };
    const refetch = (info) => {
        runFetch(info ?? true);
    };
    const actions = {
        mutate,
        refetch,
    };
    useRenderEffect(() => {
        disposed = useCheapDisposed();
        const lookup = get(source);
        runFetch(false, lookup);
    });
    return [assign(useReadonly(resource), resourceFunction), actions];
}
//# sourceMappingURL=use-resource.js.map