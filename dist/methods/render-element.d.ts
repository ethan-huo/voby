import type { JSX } from '../jsx/types';
import type { Child, Component, Props, Ref } from '../types';
type RenderCallback<State> = (props: Props, state: State) => Child;
type IntrinsicTag = keyof JSX.IntrinsicElements;
type RenderProp<State> = RenderCallback<State> | IntrinsicTag | Node;
type RenderElementComponentProps<State> = Props & {
    render?: RenderProp<State>;
};
type RenderElementParameters<State> = {
    enabled?: boolean;
    props?: Props | Props[] | ((props: Props) => Props);
    ref?: Ref | Ref[];
    state?: State;
};
export declare const renderElement: <State = {}>(component: Component, componentProps?: RenderElementComponentProps<State>, params?: RenderElementParameters<State>) => Child;
export {};
//# sourceMappingURL=render-element.d.ts.map