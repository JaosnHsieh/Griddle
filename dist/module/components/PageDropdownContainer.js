'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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

var enhance = (0, _griddleConnect.connect)(function (state, props) {
  return {
    maxPages: (0, _dataSelectors.maxPageSelector)(state, props),
    currentPage: (0, _dataSelectors.currentPageSelector)(state, props),
    className: (0, _dataSelectors.classNamesForComponentSelector)(state, 'PageDropdown'),
    style: (0, _dataSelectors.stylesForComponentSelector)(state, 'PageDropdown')
  };
});

exports.default = enhance;