var normalize = require('../normalize');
var status = require('../status');
var util = require('../util');

module.exports = init;

function getStatus(err, response) {
  if (err) {
    switch (err.status) {
      case 403: return status.failure;
      case 422: return status.empty;
      case 500: return status.error;
    }
  }
  if (!response || response.error || !response.results || response.results.length === 0) {
    return status.empty;
  }
  return status.success;
}

function getUrl(url, key, op, query) {
  var q = [];
  var verb;
  switch(op) {
    case 'forward':
      verb = 'geocode';
      q.push('q=' + encodeURIComponent(query.address || query.place));
      break;
    case 'reverse':
      verb = 'reverse';
      q.push('q=' + query.ll[1] + ',' + query.ll[0]); // latitude, longitude
      break;
    default:
      // invalid operation
      return;
  }
  q.push('api_key=' + key);
  return url + verb + '?' + q.join('&');
}

function prepareRequest() {
  return true;
}

function map(f) {
  var address = f.address_components;
  var location = f.location;
  var place = {
    ll: [ location.lng, location.lat ],
    place: f.name,
    housenumber: address.number,
    street: address.street,
    town: address.city,
    county: address.county,
    province: address.state,
    country: normalize.country(address.country),
    address: f.formatted_address
  };

  // remove empties
  return util.removeEmpties(place);
}

function processResponse(response, query, result) {
  result.places = response.results.map(map);
  return result;
}

function init(options) {
  options = util.defaults(options, {
    forward: true,
    reverse: true,
    url: getUrl.bind(undefined,
        options.geocodio_url || 'https://api.geocod.io/v1.3/',
        options.geocodio_key),
    status: getStatus,
    prepareRequest: prepareRequest,
    processResponse: processResponse
  });
  if (options.geocodio_parameters) {
    options = util.defaults(options, options.geocodio_parameters);
  }
  return require('..')(options);
}
