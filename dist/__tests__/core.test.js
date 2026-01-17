import { describe, expect, it } from 'vitest';
import { $, batch, isObservable, resolve, store, untrack, useEffect, useMemo, useReadonly, } from '../index';
const flushEffects = () => new Promise((resolve) => queueMicrotask(() => queueMicrotask(() => resolve())));
describe('core reactivity', () => {
    it('creates observable values', () => {
        const value = $(1);
        expect(isObservable(value)).toBe(true);
        expect(value()).toBe(1);
        value(3);
        expect(value()).toBe(3);
    });
    it('supports batch updates', async () => {
        const value = $(0);
        let runs = 0;
        const dispose = useEffect(() => {
            value();
            runs += 1;
        });
        await flushEffects();
        expect(runs).toBe(1);
        batch(() => {
            value(1);
            value(2);
        });
        await flushEffects();
        expect(value()).toBe(2);
        expect(runs).toBe(2);
        dispose();
    });
    it('does not track reads inside untrack', async () => {
        const value = $(0);
        let runs = 0;
        const dispose = useEffect(() => {
            untrack(() => value());
            runs += 1;
        });
        await flushEffects();
        expect(runs).toBe(1);
        value(1);
        await flushEffects();
        expect(runs).toBe(1);
        dispose();
    });
    it('batches nested updates into single run', async () => {
        const value = $(0);
        let runs = 0;
        const dispose = useEffect(() => {
            value();
            runs += 1;
        });
        await flushEffects();
        batch(() => {
            value(1);
            batch(() => {
                value(2);
            });
        });
        await flushEffects();
        expect(value()).toBe(2);
        expect(runs).toBe(2);
        dispose();
    });
});
describe('core helpers', () => {
    it('memo tracks dependencies', () => {
        const value = $(1);
        const doubled = useMemo(() => value() * 2);
        expect(doubled()).toBe(2);
        value(3);
        expect(doubled()).toBe(6);
    });
    it('readonly prevents writes', () => {
        const value = $(5);
        const ro = useReadonly(value);
        expect(ro()).toBe(5);
        value(7);
        expect(ro()).toBe(7);
        expect(() => ro(10)).toThrow('A readonly Observable can not be updated');
    });
    it('store exposes reactive fields', async () => {
        const state = store({ count: 0, nested: { value: 1 } });
        let runs = 0;
        const dispose = useEffect(() => {
            state.count;
            state.nested.value;
            runs += 1;
        });
        await flushEffects();
        expect(state.count).toBe(0);
        expect(state.nested.value).toBe(1);
        expect(runs).toBe(1);
        state.count += 2;
        await flushEffects();
        expect(state.count).toBe(2);
        expect(runs).toBe(2);
        state.nested.value = 5;
        await flushEffects();
        expect(state.nested.value).toBe(5);
        expect(runs).toBe(3);
        dispose();
    });
    it('resolve wraps plain functions into memoized observables', () => {
        const resolved = resolve(() => 3);
        expect(typeof resolved).toBe('function');
        expect(resolved()).toBe(3);
    });
});
//# sourceMappingURL=core.test.js.map