var normalize = require('../normalize');
var status = require('../status');
var util = require('../util');

module.exports = init;

function getStatus(err, response) {
  if (!response) {
    return status.error;
  }
  if (!response.features || response.features.length === 0) {
    return status.empty;
  }
  return status.success;
}

/*
Examples:

https://api.openrouteservice.org/geocode/search?api_key=${OPENCAGE_KEY}&text=SS%20So%C5%82dek"
https://api.openrouteservice.org/geocode/reverse?api_key=${OPENCAGE_KEY}&point.lat=-22.6792&point.lon=14.5272"

*/

function getUrl(url, key, op, query) {
  var q = [], suffix;
  switch(op) {
    case 'forward':
      suffix = '/search';
      q.push('text=' + encodeURIComponent(query.address || query.place));
      break;
    case 'reverse':
      suffix = '/reverse';
      [
        'lon',
        'lat'
      ].forEach(function(coord, i) {
        q.push('point.' + coord + '=' + query.ll[i]);
      });
      break;
    default:
      // invalid operation
      return;
  }
  if (query.bounds) {
    [
      'min_lon',
      'min_lat',
      'max_lon',
      'max_lat'
    ].forEach(function(coord, i) {
      q.push('boundary.rec.' + coord + '=' + query.bounds[Math.floor(i / 2)][i % 2]);
    });
  }
  q.push('api_key=' + key);
  return url + suffix + '?' + q.join('&');
}

function prepareRequest() {
  return true;
}

function filter(f) {
  return f.type === 'Feature' && f.geometry && f.geometry.type === 'Point';
}

function map(f) {
  var p = f.properties;
  var place = {
    ll: f.geometry.coordinates,
    place: p.name,
    type: p.layer,
    street: p.street,
    town: p.locality,
    county: p.county,
    province: normalize.state(p.region),
    country: normalize.country(p.country)
  };
  place.address = util.address(place);

  // remove empties
  return util.removeEmpties(place);
}

function processResponse(response, query, result) {
  var features = response.features;
  result.places = features.filter(filter).map(map);
  return result;
 }

function init(options) {
  options = util.defaults(options, {
    forward: true,
    reverse: true,
    url: getUrl.bind(undefined,
        options.openroute_url || 'https://api.openrouteservice.org/geocode',
        options.openroute_key),
    status: getStatus,
    prepareRequest: prepareRequest,
    processResponse: processResponse
  });
  if (options.openroute_parameters) {
    options = util.defaults(options, options.openroute_parameters);
  }
  return require('..')(options);
}
