var normalize = require('../normalize');
var status = require('../status');
var util = require('../util');

module.exports = init;

function getStatus(err, response) {
  if (err && err !== 200) {
    return status.failure;
  }
  if (!(response && response.length)) {
    return status.empty;
  }
  return status.success;
}

function getUrl(url, op, query) {
  if (op !== 'forward') {
    // only support forward geocoding
    return;
  }
  if (!query.place) {
    // only support place
    return;
  }
  if (!Array.isArray(query.bounds)) {
    // always needs bounds
    return;
  }
  var q = [
    'q=' + encodeURIComponent(query.place),
    'sw=' + query.bounds[0].join(','),
    'ne=' + query.bounds[1].join(','),
    'limit='+ (query.max || 20)
  ];
  return url + '/api/place?' + q.join('&');
}

function prepareRequest() {
  return true;
}

function map(item) {
  var place = {
    ll: item.ll,
    place: item.name,
    street: item.street,
    town: item.city,
    county: item.county,
    province: item.state,
    country: normalize.country(item.country),
    address: item.address
  };

  // remove empties
  return util.removeEmpties(place);
}

function processResponse(response, query, result) {
  result.places = response.map(map);
  return result;
}

function init(options) {
  options = util.defaults(options, {
    forward: true,
    reverse: false,
    url: getUrl.bind(undefined, options.hogfish_url || 'https://hogfish.code42day.com'),
    status: getStatus,
    prepareRequest: prepareRequest,
    processResponse: processResponse
  });
  if (options.hogfish_parameters) {
    options = util.defaults(options, options.hogfish_parameters);
  }
  return require('..')(options);
}
