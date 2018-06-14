import * as React from "react";
import { Component } from "react";
// import { render } from "react-dom";

const Counter = React.createContext<CounterProvider>(null);
class CounterProvider extends React.Component {
  state = { count: 0 };
  inc = () => {
    this.setState({ count: this.state.count + 1 });
  };
  dec = () => {
    this.setState({ count: this.state.count - 1 });
  };
  inc_async = () => {
    setTimeout(() => {
      this.setState({ count: this.state.count + 1 });
    }, 1000);
  };
  render() {
    // 必须抽出新对象，不可以直接把 this 作为 value 传给 Provider，那样会被阻断渲染
    // CounterProvider render 不会引起 this.props.children render，所以没有性能问题
    const new_this = { ...(this as any) };
    return (
      <Counter.Provider value={new_this}>
        {this.props.children}
      </Counter.Provider>
    );
  }
}

const hoc = name => BaseComponent => p => (
  <Counter.Consumer>
    {counter => <BaseComponent {...{ ...p, [name]: counter }} />}
  </Counter.Consumer>
);

const App = () => (
  <CounterProvider>
    <Counter.Consumer>
      {counter => (
        <div>
          <div>{counter.state.count}</div>
          <button onClick={counter.inc}>inc</button>
          <button onClick={counter.dec}>dec</button>
          <button onClick={counter.inc_async}>inc_async</button>
        </div>
      )}
    </Counter.Consumer>
    <div>
      <h2>Start editing to see some magic happen {"\u2728"}</h2>
    </div>
    <Counter.Consumer>
      {counter => (
        <div>
          <div>{counter.state.count}</div>
          <button onClick={counter.inc}>inc</button>
          <button onClick={counter.dec}>dec</button>
          <button onClick={counter.inc_async}>inc_async</button>
        </div>
      )}
    </Counter.Consumer>
  </CounterProvider>
);

declare const render: (vnode: React.ReactNode, ele: HTMLElement) => void;
render(<App />, document.getElementById("root"));
