import * as React from "react";
import { Component, ReactNode, ComponentClass, ComponentType } from "react";
import { State } from "@xialvjun/state";

export type Omit<T, K extends keyof T> = Pick<
  T,
  ({ [P in keyof T]: P } &
    { [P in K]: never } & { [x: string]: never; [x: number]: never })[keyof T]
>;

export type PropsType<T extends ComponentType<any>> = T extends ComponentType<
  infer R
>
  ? R
  : any;

export type ContextConsumer<T> = ComponentClass<{
  children: (ctx: T) => ReactNode;
}>;

export class Context<S> extends State<S> {
  // Consumer: ComponentClass<{ children: (context: this) => ReactNode }> = (() => {
  // Consumer: ComponentClass<{ children: (context: Context<S>) => ReactNode }> = (() => {
  Consumer: ContextConsumer<this> = (() => {
    const self = this;
    // return class ContextConsumer extends Component<{ children: (context: Context<S>) => ReactNode }> {
    return class ContextConsumer extends Component<{
      children: (ctx: typeof self) => ReactNode;
    }> {
      boundForceUpdate = () => this.forceUpdate();
      unsubscribe: () => any;
      componentDidMount() {
        this.unsubscribe = self.onChange(this.boundForceUpdate);
      }
      componentWillUnmount() {
        this.unsubscribe();
      }
      render() {
        return this.props.children(self);
      }
    };
  })();
  Hoc = <PN extends string>(name: PN) => <CCT extends ComponentType<any>>(
    BaseComponent: CCT
  ) => (props: Omit<PropsType<CCT>, PN>): JSX.Element =>
    React.createElement(this.Consumer, null, ctx =>
      React.createElement(
        BaseComponent,
        Object.assign({}, props, { [name]: ctx })
      )
    );
}
