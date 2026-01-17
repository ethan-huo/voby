import { jsx as _jsx } from "voby/jsx-runtime";
import { describe, expect, it } from 'vitest';
import { $, For, Suspense, createElement, render, usePromise } from '../index';
const mount = () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    return root;
};
const flushDom = () => new Promise((resolve) => queueMicrotask(() => queueMicrotask(() => resolve())));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
describe('dom advanced', () => {
    it('diffs keyed list updates', async () => {
        const root = mount();
        const values = $([
            { id: 'a', value: 'A' },
            { id: 'b', value: 'B' },
            { id: 'c', value: 'C' },
        ]);
        render(_jsx("ul", { children: _jsx(For, { values: values, children: (item) => _jsx("li", { "data-id": item.id, children: item.value }) }) }), root);
        const before = Array.from(root.querySelectorAll('li')).map((node) => node.dataset.id);
        expect(before).toEqual(['a', 'b', 'c']);
        values([
            { id: 'c', value: 'C' },
            { id: 'a', value: 'A' },
            { id: 'b', value: 'B' },
        ]);
        await flushDom();
        const after = Array.from(root.querySelectorAll('li')).map((node) => node.dataset.id);
        expect(after).toEqual(['c', 'a', 'b']);
    });
    it('diffs unkeyed list updates', async () => {
        const root = mount();
        const values = $([1, 2, 3]);
        render(_jsx("ul", { children: _jsx(For, { values: values, unkeyed: true, children: (value) => _jsx("li", { children: value }) }) }), root);
        expect(root.querySelectorAll('li').length).toBe(3);
        values([4, 5]);
        await flushDom();
        expect(root.querySelectorAll('li').length).toBe(2);
        expect(root.textContent).toBe('45');
    });
    it('renders suspense fallback then resolves', async () => {
        const root = mount();
        const pending = $(true);
        const App = () => {
            const [resource] = usePromise(() => new Promise((resolve) => {
                setTimeout(() => resolve('done'), 5);
            }));
            return (_jsx(Suspense, { when: pending, fallback: _jsx("span", { children: "loading" }), children: _jsx("span", { children: () => resource().value ?? '' }) }));
        };
        render(_jsx(App, {}), root);
        await flushDom();
        expect(root.textContent).toBe('loading');
        await sleep(10);
        pending(false);
        await flushDom();
        expect(root.textContent).toBe('done');
    });
    it('cleans up events after dispose', async () => {
        const root = mount();
        const count = $(0);
        const disposer = render(_jsx("button", { onClick: () => count(count() + 1), children: count }), root);
        const button = root.querySelector('button');
        button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await flushDom();
        expect(button?.textContent).toBe('1');
        disposer();
        button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await flushDom();
        expect(count()).toBe(1);
    });
    it('can render via createElement with props', async () => {
        const root = mount();
        const value = $(1);
        const node = createElement('span', { id: 'ce', children: value });
        render(node, root);
        expect(root.textContent).toBe('1');
        value(2);
        await flushDom();
        expect(root.textContent).toBe('2');
    });
});
//# sourceMappingURL=dom-advanced.test.js.map