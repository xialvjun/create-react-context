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
var react_1 = require("react");
var state_1 = require("@xialvjun/state");
var Context = /** @class */ (function (_super) {
    __extends(Context, _super);
    function Context() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // Consumer: ComponentClass<{ children: (context: this) => ReactNode }> = (() => {
        // Consumer: ComponentClass<{ children: (context: Context<S>) => ReactNode }> = (() => {
        _this.Consumer = (function () {
            var self = _this;
            // return class ContextConsumer extends Component<{ children: (context: Context<S>) => ReactNode }> {
            return /** @class */ (function (_super) {
                __extends(ContextConsumer, _super);
                function ContextConsumer() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.boundForceUpdate = function () { return _this.forceUpdate(); };
                    return _this;
                }
                ContextConsumer.prototype.componentDidMount = function () {
                    this.unsubscribe = self.onChange(this.boundForceUpdate);
                };
                ContextConsumer.prototype.componentWillUnmount = function () {
                    this.unsubscribe();
                };
                ContextConsumer.prototype.render = function () {
                    return this.props.children(self);
                };
                return ContextConsumer;
            }(react_1.Component));
        })();
        _this.Hoc = function (name) { return function (BaseComponent) { return function (props) {
            return React.createElement(_this.Consumer, null, function (ctx) {
                var _a;
                return React.createElement(BaseComponent, Object.assign({}, props, (_a = {}, _a[name] = ctx, _a)));
            });
        }; }; };
        return _this;
    }
    return Context;
}(state_1.State));
exports.Context = Context;
