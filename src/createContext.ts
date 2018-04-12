import * as React from 'react';
import { Component, ReactNode } from 'react';

export function createContext<T extends { state: Object, setState?: never }>(model: T) {
  const listeners = [];
  const ctx = Object.assign({}, model, {
    setState(patch) {
      this.state = { ...this.state, ...patch };
      listeners.forEach(l => l());
    }
  });
  Object.keys(ctx).forEach(key => {
    if (typeof ctx[key] === 'function') {
      ctx[key] = ctx[key].bind(ctx);
    }
  });
  return class Context extends React.Component<{ children: (ctx: T & { setState(patch: any): void }) => ReactNode }> {
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
