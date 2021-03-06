'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pickBy2 = require('lodash/pickBy');

var _pickBy3 = _interopRequireDefault(_pickBy2);

var _forIn2 = require('lodash/forIn');

var _forIn3 = _interopRequireDefault(_forIn2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

var _initializer = require('./utils/initializer');

var _initializer2 = _interopRequireDefault(_initializer);

var _listenerUtils = require('./utils/listenerUtils');

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Griddle = function (_Component) {
  _inherits(Griddle, _Component);

  function Griddle(props) {
    _classCallCheck(this, Griddle);

    var _this = _possibleConstructorReturn(this, (Griddle.__proto__ || Object.getPrototypeOf(Griddle)).call(this, props));

    _this.getStoreKey = function () {
      return _this.props.storeKey || Griddle.storeKey || 'store';
    };

    var _props$core = props.core,
        core = _props$core === undefined ? _core2.default : _props$core,
        _props$storeKey = props.storeKey,
        storeKey = _props$storeKey === undefined ? Griddle.storeKey || 'store' : _props$storeKey;

    var _init$call = _initializer2.default.call(_this, core),
        initialState = _init$call.initialState,
        reducer = _init$call.reducer,
        reduxMiddleware = _init$call.reduxMiddleware;

    var composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || _redux.compose;
    _this.store = (0, _redux.createStore)(reducer, initialState, composeEnhancers(_redux.applyMiddleware.apply(undefined, _toConsumableArray(reduxMiddleware))));

    _this.provider = (0, _reactRedux.createProvider)(storeKey);

    _this.storeListener = new _listenerUtils.StoreListener(_this.store);
    (0, _forIn3.default)(_this.listeners, function (listener, name) {
      _this.storeListener.addListener(listener, name, { events: _this.events, selectors: _this.selectors });
    });
    return _this;
  }

  _createClass(Griddle, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      var newState = (0, _pickBy3.default)(nextProps, function (value, key) {
        return _this2.props[key] !== value;
      });

      // Only update the state if something has changed.
      if (Object.keys(newState).length > 0) {
        this.store.dispatch(actions.updateState(newState));
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      // As relevant property updates are captured in `componentWillReceiveProps`.
      // return false to prevent the the entire root node from being deleted.
      return false;
    }
  }, {
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        components: this.components,
        settingsComponentObjects: this.settingsComponentObjects,
        events: this.events,
        selectors: this.selectors,
        storeKey: this.getStoreKey(),
        storeListener: this.storeListener
      };
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.components.Layout) {
        return null;
      }

      return _react2.default.createElement(
        this.provider,
        { store: this.store },
        _react2.default.createElement(this.components.Layout, null)
      );
    }
  }]);

  return Griddle;
}(_react.Component);

Griddle.childContextTypes = {
  components: _propTypes2.default.object.isRequired,
  settingsComponentObjects: _propTypes2.default.object,
  events: _propTypes2.default.object,
  selectors: _propTypes2.default.object,
  storeKey: _propTypes2.default.string,
  storeListener: _propTypes2.default.object
};


Griddle.storeKey = 'store';

exports.default = Griddle;