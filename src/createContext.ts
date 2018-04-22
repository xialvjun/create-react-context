import * as React from 'react';
import { Component, ReactNode } from 'react';

export function createContext<S, M extends { state: S, setState?: never }>(model: M) {
  const listeners = [];

  let timeout = null;
  let new_state = null;
  let callbacks= [];

  function updater() {
    timeout = null;
    ctx.state = new_state;
    new_state = null;
    const cbs = callbacks.slice();
    callbacks = [];
    cbs.forEach(it => it());
    listeners.forEach(it => it());
  }

  const ctx = Object.assign({}, model, {
    setState<K extends keyof S>(
      partialState: ((prevState: Readonly<S>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
      callback?: () => void
    ) {
      callback && callbacks.push(callback);
      const current_state = new_state || ctx.state;
      if (typeof partialState === 'function') {
        partialState = partialState(current_state);
      }
      new_state = Object.assign({}, current_state, partialState);
      clearTimeout(timeout);
      timeout = setTimeout(updater, 0);
    }
  });
  Object.keys(ctx).forEach(key => {
    if (typeof ctx[key] === 'function') {
      ctx[key] = ctx[key].bind(ctx);
    }
  });

  return class Context extends Component<{ children: (context: typeof ctx) => ReactNode }> {
    static getContext = () => ctx
    static hoc = (name: string) => BaseComponent => class HOC extends Component {
      __update__ = () => this.forceUpdate()
      componentDidMount() {
        listeners.push(this.__update__);
      }
      componentWillUnmount() {
        listeners.splice(listeners.indexOf(this.__update__), 1);
      }
      render() {
        return React.createElement(BaseComponent, { ...this.props, [name]: ctx });
      }
    }
    __update__ = () => this.forceUpdate()
    componentDidMount() {
      listeners.push(this.__update__);
    }
    componentWillUnmount() {
      listeners.splice(listeners.indexOf(this.__update__), 1);
    }
    render() {
      return this.props.children(ctx);
    }
  }
}
