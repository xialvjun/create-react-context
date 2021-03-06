import * as React from 'react';
import { render } from 'react-dom';
// instead of 'react-adopt', I recommend my '@xialvjun/react-compose'. 'react-adopt' has some bugs.
import { Compose } from '@xialvjun/react-compose';

import { createContext } from './index';


// setState is async
const Counter = createContext({
  state: { count: 0 },
  increment_version_1() {
    // assume now `this.state.count === 0`
    console.log('1. now the count is ', this.state.count);   // 1. 0
    this.setState({ count: this.state.count + 1 });
    console.log('2. now the count is ', this.state.count);   // 2. 0
    this.setState(state => {
      console.log('3. now the count is ', state.count);      // 3. 1
      return { count: state.count + 1 };
    }, () => {
      console.log('7. now the count is ', this.state.count); // 7. 3
    });
    console.log('4. now the count is ', this.state.count);   // 4. 0
    this.setState(state => {
      console.log('5. now the count is ', state.count);      // 5. 2
      return { count: state.count + 1 };
    }, () => {
      console.log('8. now the count is ', this.state.count); // 8. 3
    });
    console.log('6. now the count is ', this.state.count);   // 6. 0
  },
  increment_version_2() {
    // assume now `this.state.count === 0`
    console.log('1. now the count is ', this.state.count);   // 1. 0
    this.setState({ count: this.state.count + 1 });
    console.log('2. now the count is ', this.state.count);   // 2. 0
    this.setState(state => {
      console.log('3. now the count is ', state.count);      // 3. 1
      return { count: state.count + 1 };
    }, () => {
      console.log('8. now the count is ', this.state.count); // 8. 1
    });
    console.log('4. now the count is ', this.state.count);   // 4. 0
    this.setState(state => {
      console.log('5. now the count is ', state.count);      // 5. 2
      return { count: state.count + 1 };
    }, () => {
      console.log('9. now the count is ', this.state.count); // 9. 1
    });
    console.log('6. now the count is ', this.state.count);   // 6. 0
    this.setState({ count: this.state.count + 1 });
    console.log('7. now the count is ', this.state.count);   // 7. 0
  },
  increment_version_3() {
    // there is also a `setStateSync`
    // assume now `this.state.count === 0`
    console.log('1. now the count is ', this.state.count);            // 1. 0
    this.setStateSync({ count: this.state.count + 1 });
    console.log('2. now the count is ', this.state.count);            // 2. 1
    const old_state = this.state;
    this.setStateSync({ count: this.state.count + 1 });
    // state is replaced rather than modified
    console.log('3. now the old_state.count is ', old_state.count);   // 3. 1
    console.log('4. now the count is ', this.state.count);            // 4. 2
    this.setStateSync({ count: this.state.count + 1 });
    console.log('5. now the count is ', this.state.count);            // 5. 3
  },
  set_to_0: () => {
    // ! use normal function and use this in it, you don't have right type signature.
    // ! It means editor can not autocomplete this.set_to_0
    // * but you can use Counter.getContext() to get the real context obj, then the autcomplete will be fine
    // * so because you didn't use this in the function, you can use arrow function.
    Counter.getContext().setState({ count: 0 });
  },
  increment_async() {
    setTimeout(() => {
      this.setState({ count: this.state.count + 1 });
    }, 1000);
  },
});

const setState_is_async = <Counter>
  {counter => <div>
    <div>{counter.state.count}</div>
    <button onClick={counter.set_to_0}>set_to_0</button>
    <button onClick={counter.increment_version_1}>increment_version_1</button>
    <button onClick={counter.increment_version_2}>increment_version_2</button>
    <button onClick={counter.increment_version_3}>increment_version_3</button>
    <button onClick={counter.increment_async}>increment_async</button>
  </div>}
</Counter>

const Auth = createContext({
  state: { logined: false },
  login() {
    setTimeout(() => {
      this.setState({ logined: true });
    }, 1000);
  },
  logout() {
    this.setState({ logined: false });
  },
});

const we_can_compose_the_render_props = <Compose mapper={{ counter: Counter, auth: Auth }}>
  {({ counter, auth }) => <div>
    {counter.state.count}
  </div>}
</Compose>

// you can operate the context outside of React
const counter = Counter.getContext();
counter.increment_async();

// you can not only use Render Props Component, but also HOC
const CustomComponent = ({ counter }) => {
  return <div>{counter.state.count}</div>
}
const WrappedCustomComponent = Counter.hoc('counter')(CustomComponent);


function App() {
  return <div>
    <Counter>
      {counter => <div>
        <div>{counter.state.count}</div>
        <button onClick={counter.set_to_0}>set_to_0</button>
        <button onClick={counter.increment_version_1}>increment_version_1</button>
        <button onClick={counter.increment_version_2}>increment_version_2</button>
        <button onClick={counter.increment_version_3}>increment_version_3</button>
        <button onClick={counter.increment_async}>increment_async</button>
      </div>}
    </Counter>
    Something Others
    <Counter>
      {counter => <div>
        <div>{counter.state.count}</div>
        <button onClick={counter.set_to_0}>set_to_0</button>
      </div>}
    </Counter>
    <Compose mapper={{ counter: Counter, auth: <Auth>{_=>_}</Auth>, counter2: ({ children }) => <Counter>{children}</Counter> }}>
      {({ counter, auth, counter2 }) => null}
    </Compose>
  </div>
}
render(<App />, document.querySelector('#root'));
