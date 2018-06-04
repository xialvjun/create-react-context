"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_dom_1 = require("react-dom");
// instead of 'react-adopt', I recommend my '@xialvjun/react-compose'. 'react-adopt' has some bugs.
var react_compose_1 = require("@xialvjun/react-compose");
var index_1 = require("./index");
var CounterContext = /** @class */ (function (_super) {
    __extends(CounterContext, _super);
    function CounterContext() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { count: 0 };
        _this.increment_version_1 = function () {
            // assume now `this.state.count === 0`
            console.log("1. now the count is ", _this.state.count); // 1. 0
            _this.setState({ count: _this.state.count + 1 });
            console.log("2. now the count is ", _this.state.count); // 2. 0
            _this.setState(function (state) {
                console.log("3. now the count is ", state.count); // 3. 1
                return { count: state.count + 1 };
            }, function () {
                console.log("7. now the count is ", _this.state.count); // 7. 3
            });
            console.log("4. now the count is ", _this.state.count); // 4. 0
            _this.setState(function (state) {
                console.log("5. now the count is ", state.count); // 5. 2
                return { count: state.count + 1 };
            }, function () {
                console.log("8. now the count is ", _this.state.count); // 8. 3
            });
            console.log("6. now the count is ", _this.state.count); // 6. 0
        };
        _this.increment_version_2 = function () {
            // assume now `this.state.count === 0`
            console.log("1. now the count is ", _this.state.count); // 1. 0
            _this.setState({ count: _this.state.count + 1 });
            console.log("2. now the count is ", _this.state.count); // 2. 0
            _this.setState(function (state) {
                console.log("3. now the count is ", state.count); // 3. 1
                return { count: state.count + 1 };
            }, function () {
                console.log("8. now the count is ", _this.state.count); // 8. 1
            });
            console.log("4. now the count is ", _this.state.count); // 4. 0
            _this.setState(function (state) {
                console.log("5. now the count is ", state.count); // 5. 2
                return { count: state.count + 1 };
            }, function () {
                console.log("9. now the count is ", _this.state.count); // 9. 1
            });
            console.log("6. now the count is ", _this.state.count); // 6. 0
            _this.setState({ count: _this.state.count + 1 });
            console.log("7. now the count is ", _this.state.count); // 7. 0
        };
        _this.increment_version_3 = function () {
            // there is also a `setStateSync`
            // assume now `this.state.count === 0`
            console.log("1. now the count is ", _this.state.count); // 1. 0
            _this.setStateSync({ count: _this.state.count + 1 });
            console.log("2. now the count is ", _this.state.count); // 2. 1
            var old_state = _this.state;
            _this.setStateSync({ count: _this.state.count + 1 });
            // state is replaced rather than modified
            console.log("3. now the old_state.count is ", old_state.count); // 3. 1
            console.log("4. now the count is ", _this.state.count); // 4. 2
            _this.setStateSync({ count: _this.state.count + 1 });
            console.log("5. now the count is ", _this.state.count); // 5. 3
        };
        _this.set_to_0 = function () {
            _this.setState({ count: 0 });
        };
        _this.increment_async = function () {
            setTimeout(function () {
                _this.setState({ count: _this.state.count + 1 });
            }, 1000);
        };
        return _this;
    }
    return CounterContext;
}(index_1.Context));
var CounterContextInstance = new CounterContext();
var Counter = CounterContextInstance.Consumer;
var setState_is_async = (React.createElement(Counter, null, function (counter) { return (React.createElement("div", null,
    React.createElement("div", null, counter.state.count),
    React.createElement("button", { onClick: counter.set_to_0 }, "set_to_0"),
    React.createElement("button", { onClick: counter.increment_version_1 }, "increment_version_1"),
    React.createElement("button", { onClick: counter.increment_version_2 }, "increment_version_2"),
    React.createElement("button", { onClick: counter.increment_version_3 }, "increment_version_3"),
    React.createElement("button", { onClick: counter.increment_async }, "increment_async"))); }));
var AuthContext = /** @class */ (function (_super) {
    __extends(AuthContext, _super);
    function AuthContext() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.login = function () {
            setTimeout(function () {
                _this.setState({ logined: true });
            }, 1000);
        };
        _this.logout = function () {
            _this.setState({ logined: false });
        };
        return _this;
    }
    return AuthContext;
}(index_1.Context));
var AuthContextInstance = new AuthContext({ logined: false });
var Auth = AuthContextInstance.Consumer;
var Login = AuthContextInstance.Hoc("auth")(function (p) { return (React.createElement("div", null, p.auth.state.logined ? React.createElement("div", null, "logout") : React.createElement("div", null, "login"))); });
var NoActionContext_Person = new index_1.Context({ name: "xialvjun", age: 28 });
function SomeThing(_a) {
    var person = _a.person, extra = _a.extra;
    return (React.createElement("div", { onClick: function (_) { return person.setState({ age: person.state.age + 1 }); } }, person.state.name));
}
var WithPerson = NoActionContext_Person.Hoc("person")(SomeThing);
// only extra is needed in typescript
React.createElement(WithPerson, { extra: "asdfdsf" });
var we_can_compose_the_render_props = (React.createElement(react_compose_1.Compose, { mapper: { counter: Counter, auth: Auth } }, function (_a) {
    var counter = _a.counter, auth = _a.auth;
    return React.createElement("div", null, counter.state.count);
}));
// you can operate the context outside of React
// const counter = Counter.getContext();
CounterContextInstance.increment_async();
// you can not only use Render Props Component, but also HOC
var CustomComponent = function (_a) {
    var counter = _a.counter;
    return React.createElement("div", null, counter.state.count);
};
var WrappedCustomComponent = CounterContextInstance.Hoc("counter")(CustomComponent);
function OldRenderProps(_a) {
    var render = _a.render;
    return render({ name: "xialvjun" });
}
function App() {
    return (React.createElement("div", null,
        React.createElement(Counter, null, function (counter) { return (React.createElement("div", null,
            React.createElement("div", null, counter.state.count),
            React.createElement("button", { onClick: counter.set_to_0 }, "set_to_0"),
            React.createElement("button", { onClick: counter.increment_version_1 }, "increment_version_1"),
            React.createElement("button", { onClick: counter.increment_version_2 }, "increment_version_2"),
            React.createElement("button", { onClick: counter.increment_version_3 }, "increment_version_3"),
            React.createElement("button", { onClick: counter.increment_async }, "increment_async"))); }),
        "Something Others",
        React.createElement(Counter, null, function (counter) { return (React.createElement("div", null,
            React.createElement("div", null, counter.state.count),
            React.createElement("button", { onClick: counter.set_to_0 }, "set_to_0"))); }),
        React.createElement(react_compose_1.Compose, { mapper: {
                counter: Counter,
                auth: React.createElement(Auth, null, function (_) { return _; }),
                old_render_props: function (_a) {
                    var children = _a.children;
                    return (React.createElement(OldRenderProps, { render: children }));
                }
            } }, function (_a) {
            var counter = _a.counter, auth = _a.auth, counter2 = _a.counter2;
            return null;
        })));
}
react_dom_1.render(React.createElement(App, null), document.querySelector("#root"));
