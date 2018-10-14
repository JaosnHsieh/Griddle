'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.textSelector = exports.cellPropertiesSelector = exports.rowPropertiesSelector = exports.classNamesForComponentSelector = exports.stylesForComponentSelector = exports.iconsByNameSelector = exports.iconsForComponentSelector = exports.rowDataSelector = exports.cellValueSelector = exports.columnTitlesSelector = exports.columnIdsSelector = exports.hiddenColumnsSelector = exports.visibleRowCountSelector = exports.visibleRowIdsSelector = exports.visibleDataSelector = exports.currentPageDataSelector = exports.sortedDataSelector = exports.hasPreviousSelector = exports.hasNextSelector = exports.visibleColumnsSelector = exports.sortedColumnPropertiesSelector = exports.allColumnsSelector = exports.maxPageSelector = exports.filteredDataSelector = exports.metaDataColumnsSelector = exports.renderPropertiesSelector = exports.sortMethodSelector = exports.sortPropertiesSelector = exports.filterSelector = exports.pageSizeSelector = exports.currentPageSelector = exports.dataLoadingSelector = exports.dataSelector = undefined;

var _isFinite2 = require('lodash/isFinite');

var _isFinite3 = _interopRequireDefault(_isFinite2);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reselect = require('reselect');

var _sortUtils = require('../../../utils/sortUtils');

var _dataUtils = require('../../../utils/dataUtils');

var _dataSelectors = require('../../../selectors/dataSelectors');

var dataSelectors = _interopRequireWildcard(_dataSelectors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/** Gets the entire data set
 * @param {Immutable} state - state object
 */
var dataSelector = exports.dataSelector = function dataSelector(state) {
  return state.get('data');
};

var dataLoadingSelector = exports.dataLoadingSelector = dataSelectors.dataLoadingSelector;

/** Gets the current page from pageProperties
 * @param {Immutable} state - state object
 */
var currentPageSelector = exports.currentPageSelector = function currentPageSelector(state) {
  return state.getIn(['pageProperties', 'currentPage']);
};

/** Gets the currently set page size
 * @param {Immutable} state - state object
 */
var pageSizeSelector = exports.pageSizeSelector = function pageSizeSelector(state) {
  return state.getIn(['pageProperties', 'pageSize']);
};

/** Gets the currently set filter
 */
var filterSelector = exports.filterSelector = function filterSelector(state) {
  return state.get('filter') || '';
};

var sortPropertiesSelector = exports.sortPropertiesSelector = function sortPropertiesSelector(state) {
  return state.get('sortProperties');
};

var sortMethodSelector = exports.sortMethodSelector = function sortMethodSelector(state) {
  return state.get('sortMethod');
};

var renderPropertiesSelector = exports.renderPropertiesSelector = function renderPropertiesSelector(state) {
  return state.get('renderProperties');
};

var metaDataColumnsSelector = exports.metaDataColumnsSelector = dataSelectors.metaDataColumnsSelector;

var columnPropertiesSelector = function columnPropertiesSelector(state) {
  return state.getIn(['renderProperties', 'columnProperties']);
};

var substringSearch = function substringSearch(value, filter) {
  if (!filter) {
    return true;
  }

  var filterToLower = filter.toLowerCase();
  return value && value.toString().toLowerCase().indexOf(filterToLower) > -1;
};

var filterable = function filterable(columnProperties, key) {
  if (key === 'griddleKey') {
    return false;
  }
  if (columnProperties) {
    if (columnProperties.get(key) === undefined || columnProperties.getIn([key, 'filterable']) === false) {
      return false;
    }
  }
  return true;
};

var textFilterRowSearch = function textFilterRowSearch(columnProperties, filter) {
  return function (row) {
    return row.keySeq().some(function (key) {
      if (!filterable(columnProperties, key)) {
        return false;
      }
      return substringSearch(row.get(key), filter);
    });
  };
};

var objectFilterRowSearch = function objectFilterRowSearch(columnProperties, filter) {
  return function (row, i, data) {
    return row.keySeq().every(function (key) {
      if (!filterable(columnProperties, key)) {
        return true;
      }
      var keyFilter = filter.get(key);
      switch (typeof keyFilter === 'undefined' ? 'undefined' : _typeof(keyFilter)) {
        case 'string':
          return substringSearch(row.get(key), keyFilter);
          break;
        case 'function':
          return keyFilter(row.get(key), i, data);
          break;
        default:
          return true;
          break;
      }
    });
  };
};

/** Gets the data filtered by the current filter
 */
var filteredDataSelector = exports.filteredDataSelector = (0, _reselect.createSelector)(dataSelector, filterSelector, columnPropertiesSelector, function (data, filter, columnProperties) {
  if (!filter || !data) {
    return data;
  }

  switch (typeof filter === 'undefined' ? 'undefined' : _typeof(filter)) {
    case 'string':
      return data.filter(textFilterRowSearch(columnProperties, filter));
    case 'object':
      return data.filter(objectFilterRowSearch(columnProperties, filter));
    case 'function':
      return data.filter(filter);
    default:
      return data;
  }
});

/** Gets the max page size
 */
var maxPageSelector = exports.maxPageSelector = (0, _reselect.createSelector)(pageSizeSelector, filteredDataSelector, function (pageSize, data) {
  var total = data ? data.size : 0;
  var calc = total / pageSize;

  var result = calc > Math.floor(calc) ? Math.floor(calc) + 1 : Math.floor(calc);

  return (0, _isFinite3.default)(result) ? result : 1;
});

var allColumnsSelector = exports.allColumnsSelector = (0, _reselect.createSelector)(dataSelector, function (data) {
  return !data || data.size === 0 ? [] : data.get(0).keySeq().toJSON();
});

/** Gets the column properties objects sorted by order
 */
var sortedColumnPropertiesSelector = exports.sortedColumnPropertiesSelector = dataSelectors.sortedColumnPropertiesSelector;

/** Gets the visible columns either obtaining the sorted column properties or all columns
 */
var visibleColumnsSelector = exports.visibleColumnsSelector = dataSelectors.visibleColumnsSelector;

/** Returns whether or not this result set has more pages
 */
var hasNextSelector = exports.hasNextSelector = (0, _reselect.createSelector)(currentPageSelector, maxPageSelector, function (currentPage, maxPage) {
  return currentPage < maxPage;
});

/** Returns whether or not there is a previous page to the current data
 */
var hasPreviousSelector = exports.hasPreviousSelector = function hasPreviousSelector(state) {
  return state.getIn(['pageProperties', 'currentPage']) > 1;
};

/** Gets the data sorted by the sort function specified in render properties
 *  if no sort method is supplied, it will use the default sort defined in griddle
 */
var sortedDataSelector = exports.sortedDataSelector = (0, _reselect.createSelector)(filteredDataSelector, sortPropertiesSelector, renderPropertiesSelector, sortMethodSelector, function (filteredData, sortProperties, renderProperties) {
  var sortMethod = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _sortUtils.defaultSort;

  if (!sortProperties) {
    return filteredData;
  }

  return sortProperties.reverse().reduce(function (data, sortColumnOptions) {
    var columnProperties = renderProperties && renderProperties.get('columnProperties').get(sortColumnOptions.get('id'));

    var sortFunction = columnProperties && columnProperties.get('sortMethod') || sortMethod;

    return sortFunction(data, sortColumnOptions.get('id'), sortColumnOptions.get('sortAscending'));
  }, filteredData);
});

/** Gets the current page of data
 */
var currentPageDataSelector = exports.currentPageDataSelector = (0, _reselect.createSelector)(sortedDataSelector, pageSizeSelector, currentPageSelector, function (sortedData, pageSize, currentPage) {
  if (!sortedData) {
    return [];
  }

  return sortedData.skip(pageSize * (currentPage - 1)).take(pageSize);
});

/** Get the visible data (and only the columns that are visible)
 */
var visibleDataSelector = exports.visibleDataSelector = (0, _reselect.createSelector)(currentPageDataSelector, visibleColumnsSelector, function (currentPageData, visibleColumns) {
  return (0, _dataUtils.getVisibleDataForColumns)(currentPageData, visibleColumns);
});

/** Gets the griddleIds for the visible rows */
var visibleRowIdsSelector = exports.visibleRowIdsSelector = (0, _reselect.createSelector)(currentPageDataSelector, function (currentPageData) {
  return currentPageData ? currentPageData.map(function (c) {
    return c.get('griddleKey');
  }) : new _immutable2.default.List();
});

/** Gets the count of visible rows */
var visibleRowCountSelector = exports.visibleRowCountSelector = (0, _reselect.createSelector)(visibleRowIdsSelector, function (visibleRowIds) {
  return visibleRowIds.size;
});

/** Gets the columns that are not currently visible
 */
var hiddenColumnsSelector = exports.hiddenColumnsSelector = (0, _reselect.createSelector)(visibleColumnsSelector, allColumnsSelector, metaDataColumnsSelector, function (visibleColumns, allColumns, metaDataColumns) {
  var removeColumns = [].concat(_toConsumableArray(visibleColumns), _toConsumableArray(metaDataColumns));

  return allColumns.filter(function (c) {
    return removeColumns.indexOf(c) === -1;
  });
});

/** Gets the column ids for the visible columns
*/
var columnIdsSelector = exports.columnIdsSelector = (0, _reselect.createSelector)(visibleDataSelector, renderPropertiesSelector, function (visibleData, renderProperties) {
  if (visibleData.size > 0) {
    return Object.keys(visibleData.get(0).toJSON()).map(function (k) {
      return renderProperties.getIn(['columnProperties', k, 'id']) || k;
    });
  }
});

/** Gets the column titles for the visible columns
 */
var columnTitlesSelector = exports.columnTitlesSelector = dataSelectors.columnTitlesSelector;
var cellValueSelector = exports.cellValueSelector = dataSelectors.cellValueSelector;
var rowDataSelector = exports.rowDataSelector = dataSelectors.rowDataSelector;
var iconsForComponentSelector = exports.iconsForComponentSelector = dataSelectors.iconsForComponentSelector;
var iconsByNameSelector = exports.iconsByNameSelector = dataSelectors.iconsForComponentSelector;
var stylesForComponentSelector = exports.stylesForComponentSelector = dataSelectors.stylesForComponentSelector;
var classNamesForComponentSelector = exports.classNamesForComponentSelector = dataSelectors.classNamesForComponentSelector;

var rowPropertiesSelector = exports.rowPropertiesSelector = dataSelectors.rowPropertiesSelector;
var cellPropertiesSelector = exports.cellPropertiesSelector = dataSelectors.cellPropertiesSelector;
var textSelector = exports.textSelector = dataSelectors.textSelector;