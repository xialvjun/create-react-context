import * as React from 'react';

import { createContext } from './index';

const Counter = createContext({
  state: { count: 0 },
  increment() {
    // this will make count + 2. That means: state change is sync.
    // I choose sync state because React has done the optimization for us: Component.forceUpdate twice will just render once.
    this.setState({ count: this.state.count + 1 });
    this.setState({ count: this.state.count + 1 });
  },
  increment_async() {
    setTimeout(() => {
      this.setState({ count: this.state.count + 1 });
    }, 1000);
  },
});

const abc = <Counter>
  {counter => <div>
    <div>{counter.state.count}</div>
    <button onClick={counter.increment}>incr</button>
    <button onClick={counter.increment_async}>incr_async</button>
  </div>}
</Counter>
