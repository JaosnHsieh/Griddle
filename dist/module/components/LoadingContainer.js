'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _griddleConnect = require('../utils/griddleConnect');

var _compose = require('recompose/compose');

var _compose2 = _interopRequireDefault(_compose);

var _mapProps = require('recompose/mapProps');

var _mapProps2 = _interopRequireDefault(_mapProps);

var _getContext = require('recompose/getContext');

var _getContext2 = _interopRequireDefault(_getContext);

var _dataSelectors = require('../selectors/dataSelectors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var LoadingContainer = (0, _compose2.default)((0, _getContext2.default)({
  components: _propTypes2.default.object
}), (0, _griddleConnect.connect)(function (state) {
  return {
    className: (0, _dataSelectors.classNamesForComponentSelector)(state, 'Loading'),
    style: (0, _dataSelectors.stylesForComponentSelector)(state, 'Loading')
  };
}), (0, _mapProps2.default)(function (props) {
  var components = props.components,
      otherProps = _objectWithoutProperties(props, ['components']);

  return _extends({
    Loading: components.Loading
  }, otherProps);
}));

exports.default = LoadingContainer;