import { jsx as _jsx } from "voby/jsx-runtime";
import { describe, expect, it } from 'vitest';
import { $, For, If, createElement, render } from '../index';
const mount = () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    return root;
};
const flushDom = () => new Promise((resolve) => queueMicrotask(() => queueMicrotask(() => resolve())));
describe('dom rendering', () => {
    it('renders a simple element', () => {
        const root = mount();
        render(_jsx("div", { id: "one", children: "hello" }), root);
        const node = root.querySelector('#one');
        expect(node?.textContent).toBe('hello');
    });
    it('updates text when observable changes', async () => {
        const root = mount();
        const value = $(0);
        render(_jsx("p", { children: value }), root);
        expect(root.textContent).toBe('0');
        value(3);
        await flushDom();
        expect(root.textContent).toBe('3');
    });
    it('updates class and style props', async () => {
        const root = mount();
        const active = $(false);
        render(_jsx("div", { class: () => ({ active: active(), idle: !active() }), style: () => ({ color: active() ? 'red' : 'blue' }) }), root);
        const node = root.querySelector('div');
        expect(node?.classList.contains('active')).toBe(false);
        expect(node?.style.color).toBe('blue');
        active(true);
        await flushDom();
        expect(node?.classList.contains('active')).toBe(true);
        expect(node?.style.color).toBe('red');
    });
    it('handles If conditional rendering', async () => {
        const root = mount();
        const show = $(true);
        render(_jsx(If, { when: show, fallback: _jsx("span", { children: "no" }), children: _jsx("span", { children: "yes" }) }), root);
        expect(root.textContent).toBe('yes');
        show(false);
        await flushDom();
        expect(root.textContent).toBe('no');
    });
    it('handles For list rendering', async () => {
        const root = mount();
        const values = $([1, 2]);
        render(_jsx("ul", { children: _jsx(For, { values: values, children: (value) => _jsx("li", { children: value }) }) }), root);
        expect(root.querySelectorAll('li').length).toBe(2);
        values([1, 2, 3]);
        await flushDom();
        expect(root.querySelectorAll('li').length).toBe(3);
    });
    it('handles events', async () => {
        const root = mount();
        const count = $(0);
        render(_jsx("button", { onClick: () => count(count() + 1), children: count }), root);
        const button = root.querySelector('button');
        button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await flushDom();
        expect(button?.textContent).toBe('2');
    });
    it('supports createElement with intrinsic tag', () => {
        const root = mount();
        render(createElement('div', { id: 'created' }), root);
        const node = root.querySelector('#created');
        expect(node).toBeTruthy();
    });
});
//# sourceMappingURL=dom.test.js.map