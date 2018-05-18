# create-react-context
A dead simple way to share states across react components, using javascript scope rather than react context api.

## Install
`npm i @xialvjun/create-react-context` or `yarn add @xialvjun/create-react-context`

## Example
codesandbox.io: https://codesandbox.io/s/5zz2m570l

```jsx
import { createContext } from '@xialvjun/create-react-context';

const Auth = createContext({
  state: { logined: false },
  login() {
    setTimeout(() => {
      // here, autocomplete is not very good.
      this.setState({ logined: true });
    }, 1000);
  },
  logout: () => {
    // here, autocomplete is totally ok.
    Auth.getContext().setState({ logined: false });
  },
});

<Auth>
  {auth => <div>
    {auth.state.logined ?
    <button onClick={auth.logout}>logout</button> :
    <button onClick={auth.login}>login</button>}
  </div>}
</Auth>
```


## Documents

```jsx
import { createContext } from '@xialvjun/create-react-context';
import { render } from 'react-dom';
// instead of 'react-adopt', I recommend my '@xialvjun/react-compose'. 'react-adopt' has some bugs.
import { Compose } from '@xialvjun/react-compose';


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
  set_to_0() {
    // ! use normal function and use this in it, you don't have right type signature.
    // ! It means editor can not autocomplete this.set_to_0
    // * but you can use Counter.getContext() to get the real context obj, then the autcomplete will be fine
    // * so because you didn't use this in the function, you can use arrow function.
    this.setState({ count: 0 });
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
    <Compose mapper={{ counter: Counter, auth: <Auth />, counter2: ({ children }) => <Counter>{children}</Counter> }}>
      {({ counter, auth, counter2 }) => null}
    </Compose>
  </div>
}
render(<App />, document.querySelector('#root'));
```

# Migrate from v0
1. Remove `Contexts`:
> There is a better one: [@xialvjun/react-compose](https://github.com/xialvjun/react-compose)

2. Change `setState` from sync to async:
> Its signature is the same as React.Component.setState.

3. Add `setStateSync(partialState: Object)`:
> The same as v0's `setState`.

4. Add `hoc(name: string)`:
> Render Props Component and Higher Order Component are both good things for sharing states, we shouldn't ignore any one.

# FAQ
1. Why state change is ~~sync~~async?
> ~~React has done the optimization for us: **forceUpdate twice just render once**. And sync state is easy to use.~~  
> State should keep sync with the view. But view rendering is async, `setState` should be async too.

2. Why add `setStateSync`?
> Some times we just need **Eventual Consistency** rather than **Strong Consistency** between state and view, `setStateSync` is for this.
