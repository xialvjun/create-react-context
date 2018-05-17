import * as React from 'react';
import { Component, ReactNode, ComponentClass } from 'react';
import { State } from '@xialvjun/state';


export class Context<S> extends State<S> {
  // Consumer: ComponentClass<{ children: (context: this) => ReactNode }> = (() => {
  Consumer = (() => {
    const self = this;
    // return class ContextConsumer extends Component<{ children: (context: typeof self) => ReactNode }> {
    return class ContextConsumer extends Component<{ children: (context: Context<S>) => ReactNode }> {
      boundForceUpdate = () => this.forceUpdate()
      unsubscribe: () => any
      componentDidMount() {
        this.unsubscribe = self.onChange(this.boundForceUpdate);
      }
      componentWillUnmount() {
        this.unsubscribe();
      }
      render() {
        return this.props.children(self);
      }
    }
  })();
  Hoc = (name: string) => {
    const self = this;
    return BaseComponent => class WithContext extends Component {
      boundForceUpdate = () => this.forceUpdate()
      unsubscribe: () => any
      componentDidMount() {
        this.unsubscribe = self.onChange(this.boundForceUpdate);
      }
      componentWillUnmount() {
        this.unsubscribe();
      }
      render() {
        return React.createElement(BaseComponent, { ...this.props, [name]: self });
      }
    }
  };
}
