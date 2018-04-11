# create-react-context
A dead simple way to share states across react components, using javascript scope rather than react context api.

## Example
codesandbox.io: https://codesandbox.io/s/977z8440o

```jsx
import { createContext, Contexts } from '@xialvjun/create-react-context';

const Counter = createContext({
  state: { count: 0 },
  add_one() {
    this.setState({ count: this.state.count + 1 });
  },
  // ! you can not use arrow function here
  add_two: function() {
    // ! state change is sync
    this.setState({ count: this.state.count + 1 });
    this.setState({ count: this.state.count + 1 });
  },
  add_one_async() {
    // ! of course, arrow function is ok here
    setTimeout(() => {
      this.setState({ count: this.state.count + 1 });
    }, 1000);
  }
});

const Auth = createContext({ state: { logined: false } });

function App() {
  return <div>
    <Counter>
      {counter => <div>
        {counter.state.count}
        <button onClick={counter.add_one}>add_one</button>
        <button onClick={counter.add_one_async}>add_one_async</button>
      </div>}
    </Counter>
    Something Others
    <Counter>
      {counter => <div>
        whatever + {counter.state.count}
        <button onClick={counter.add_two}>add_two</button>
      </div>}
    </Counter>
    <Contexts ctxs={[Counter, Auth]}>
      {(counter, auth) => null}
    </Contexts>
  </div>
}

render(<App />, document.querySelector('#root'));
```

# FAQ
1. Why state change is sync?
> React has done the optimization for us: **forceUpdate twice just render once**. And sync state is easy to use.

2. Why can not I use arrow function?
> I need to bind your functions on an object to make `this` in your functions correct.
