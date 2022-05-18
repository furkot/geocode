const { country: { abbr2country }, state: { state2abbr }} = require('@furkot/address');
const status = require('../status');
const { defaults, removeEmpties } = require('../util');

module.exports = init;

/*
 * https://docs.graphhopper.com/#tag/Geocoding-API
 */

function getStatus(err, response) {
  if (!response || !response.hits || response.hits.length === 0) {
    return status.empty;
  }
  return status.success;
}

function getUrl(url, key, op, query) {
  const q = [];
  if (query.max) {
    q.push('limit=' + query.max);
  }
  switch(op) {
    case 'forward':
      q.push('q=' + encodeURIComponent(query.address || query.place));
      if (query.bounds) {
        const ll = [
          (query.bounds[0][0] + query.bounds[1][0]) / 2,
          (query.bounds[0][1] + query.bounds[1][1]) / 2
        ];
        q.push('point=' + ll[1] + ',' + ll[0]); // latitude, longitude
      }
      if (query.partial) {
        q.push('autocomplete=true');
      }
      break;
    case 'reverse':
      q.push('reverse=true');
      q.push('point=' + query.ll[1] + ',' + query.ll[0]); // latitude, longitude
      break;
    default:
      // invalid operation
      return;
  }
  if (query.lang) {
    q.push('locale=' + query.lang);
  }
  q.push('key=' + key);
  return url + '?' + q.join('&');
}

function prepareRequest() {
  return true;
}

function mapType({ osm_key, osm_value, name, housenumber, street }) {
  if (!osm_value || osm_value === 'yes') {
    if (osm_key === 'building') {
      return 'venue';
    }
    return 'address';
  }
  if (name === [housenumber, street].join(' ')) {
    return 'address';
  }
  if (osm_key === 'highway') {
    return 'street';
  }
  return osm_value;
}

function map(f) {
  const {
    city,
    country,
    countrycode,
    housenumber: house,
    name,
    point: { lat, lng },
    state,
    street
  } = f;
  const place = {
    ll: [lng, lat],
    type: mapType(f),
    house,
    street,
    city,
    state: state2abbr[state] || state,
    country: abbr2country[countrycode] || country || countrycode
  };
  if (!place.street && place.type === 'street') {
    place.street = name;
  }
  if (place.type !== 'address') {
    place.place = name;
  }
  // remove empties
  return removeEmpties(place);
}

function processResponse(response, query, result) {
  const hits = response.hits;
  result.places = hits.map(map);
  return result;
 }

function init(options) {
  options = defaults(options, {
    forward: true,
    reverse: true,
    url: getUrl.bind(undefined,
        options.graphhopper_url || 'https://graphhopper.com/api/1/geocode',
        options.graphhopper_key),
    status: getStatus,
    prepareRequest,
    processResponse
  });
  if (options.graphhopper_parameters) {
    options = defaults(options, options.graphhopper_parameters);
  }
  return require('..')(options);
}
