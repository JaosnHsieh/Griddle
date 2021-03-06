'use strict';

var _flatten2 = require('lodash/flatten');

var _flatten3 = _interopRequireDefault(_flatten2);

var _compact2 = require('lodash/compact');

var _compact3 = _interopRequireDefault(_compact2);

var _pickBy2 = require('lodash/pickBy');

var _pickBy3 = _interopRequireDefault(_pickBy2);

var _merge2 = require('lodash/merge');

var _merge3 = _interopRequireDefault(_merge2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _compositionUtils = require('./compositionUtils');

var _columnUtils = require('./columnUtils');

var _rowUtils = require('./rowUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

module.exports = function initializer(defaults) {
  if (!this) throw new Error('this missing!');

  var _ref = defaults || {},
      defaultReducer = _ref.reducer,
      components = _ref.components,
      settingsComponentObjects = _ref.settingsComponentObjects,
      selectors = _ref.selectors,
      defaultStyleConfig = _ref.styleConfig,
      defaultInitialState = _objectWithoutProperties(_ref, ['reducer', 'components', 'settingsComponentObjects', 'selectors', 'styleConfig']);

  var _props = this.props,
      _props$plugins = _props.plugins,
      plugins = _props$plugins === undefined ? [] : _props$plugins,
      _props$data = _props.data,
      data = _props$data === undefined ? [] : _props$data,
      rowPropertiesComponent = _props.children,
      _props$events = _props.events,
      userEvents = _props$events === undefined ? {} : _props$events,
      _props$styleConfig = _props.styleConfig,
      userStyleConfig = _props$styleConfig === undefined ? {} : _props$styleConfig,
      userComponents = _props.components,
      _props$renderProperti = _props.renderProperties,
      userRenderProperties = _props$renderProperti === undefined ? {} : _props$renderProperti,
      userSettingsComponentObjects = _props.settingsComponentObjects,
      _props$reduxMiddlewar = _props.reduxMiddleware,
      reduxMiddleware = _props$reduxMiddlewar === undefined ? [] : _props$reduxMiddlewar,
      _props$listeners = _props.listeners,
      listeners = _props$listeners === undefined ? {} : _props$listeners,
      userInitialState = _objectWithoutProperties(_props, ['plugins', 'data', 'children', 'events', 'styleConfig', 'components', 'renderProperties', 'settingsComponentObjects', 'reduxMiddleware', 'listeners']);

  var rowProperties = (0, _rowUtils.getRowProperties)(rowPropertiesComponent);
  var columnProperties = (0, _columnUtils.getColumnProperties)(rowPropertiesComponent);

  // Combine / compose the reducers to make a single, unified reducer
  var reducer = (0, _compositionUtils.buildGriddleReducer)([defaultReducer].concat(_toConsumableArray(plugins.map(function (p) {
    return p.reducer;
  }))));

  // Combine / Compose the components to make a single component for each component type
  this.components = (0, _compositionUtils.buildGriddleComponents)([components].concat(_toConsumableArray(plugins.map(function (p) {
    return p.components;
  })), [userComponents]));

  this.settingsComponentObjects = Object.assign.apply(Object, [_extends({}, settingsComponentObjects)].concat(_toConsumableArray(plugins.map(function (p) {
    return p.settingsComponentObjects;
  })), [userSettingsComponentObjects]));

  this.events = Object.assign.apply(Object, [{}, userEvents].concat(_toConsumableArray(plugins.map(function (p) {
    return p.events;
  }))));

  this.selectors = plugins.reduce(function (combined, plugin) {
    return _extends({}, combined, plugin.selectors);
  }, _extends({}, selectors));

  var styleConfig = _merge3.default.apply(undefined, [_extends({}, defaultStyleConfig)].concat(_toConsumableArray(plugins.map(function (p) {
    return p.styleConfig;
  })), [userStyleConfig]));

  // TODO: This should also look at the default and plugin initial state objects
  var renderProperties = Object.assign.apply(Object, [{
    rowProperties: rowProperties,
    columnProperties: columnProperties
  }].concat(_toConsumableArray(plugins.map(function (p) {
    return p.renderProperties;
  })), [userRenderProperties]));

  // TODO: Make this its own method
  var initialState = _merge3.default.apply(undefined, [defaultInitialState].concat(_toConsumableArray(plugins.map(function (p) {
    return p.initialState;
  })), [userInitialState, {
    data: data,
    renderProperties: renderProperties,
    styleConfig: styleConfig
  }]));

  var sanitizedListeners = (0, _pickBy3.default)(listeners, function (value) {
    return typeof value === 'function';
  });
  this.listeners = plugins.reduce(function (combined, plugin) {
    return _extends({}, combined, (0, _pickBy3.default)(plugin.listeners, function (value) {
      return typeof value === 'function';
    }));
  }, sanitizedListeners);

  return {
    initialState: initialState,
    reducer: reducer,
    reduxMiddleware: (0, _compact3.default)([].concat(_toConsumableArray((0, _flatten3.default)(plugins.map(function (p) {
      return p.reduxMiddleware;
    }))), _toConsumableArray(reduxMiddleware)))
  };
};