/* IMPORT */
/* HELPERS */
const NOOP_CHILDREN = [];
/* MAIN */
export const FragmentUtils = {
    make: () => {
        return {
            values: undefined,
            length: 0,
        };
    },
    makeWithNode: (node) => {
        return {
            values: node,
            length: 1,
        };
    },
    makeWithFragment: (fragment) => {
        return {
            values: fragment,
            fragmented: true,
            length: 1,
        };
    },
    getChildrenFragmented: (thiz, children = []) => {
        const { values, length } = thiz;
        if (!length)
            return children;
        if (values instanceof Array) {
            for (let i = 0, l = values.length; i < l; i++) {
                const value = values[i];
                if (value instanceof Node) {
                    children.push(value);
                }
                else {
                    FragmentUtils.getChildrenFragmented(value, children);
                }
            }
        }
        else {
            if (values instanceof Node) {
                children.push(values);
            }
            else {
                FragmentUtils.getChildrenFragmented(values, children);
            }
        }
        return children;
    },
    getChildren: (thiz) => {
        if (!thiz.length)
            return NOOP_CHILDREN;
        if (!thiz.fragmented)
            return thiz.values;
        if (thiz.length === 1)
            return FragmentUtils.getChildren(thiz.values);
        return FragmentUtils.getChildrenFragmented(thiz);
    },
    pushFragment: (thiz, fragment) => {
        FragmentUtils.pushValue(thiz, fragment);
        thiz.fragmented = true;
    },
    pushNode: (thiz, node) => {
        FragmentUtils.pushValue(thiz, node);
    },
    pushValue: (thiz, value) => {
        const { values, length } = thiz; //TSC
        if (length === 0) {
            thiz.values = value;
        }
        else if (length === 1) {
            thiz.values = [values, value];
        }
        else {
            values.push(value);
        }
        thiz.length += 1;
    },
    replaceWithNode: (thiz, node) => {
        thiz.values = node;
        delete thiz.fragmented;
        thiz.length = 1;
    },
    replaceWithFragment: (thiz, fragment) => {
        thiz.values = fragment.values;
        thiz.fragmented = fragment.fragmented;
        thiz.length = fragment.length;
    },
};
//# sourceMappingURL=fragment.js.map