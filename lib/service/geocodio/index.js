const { country: { abbr2country }} = require('@furkot/address');
const status = require('../status');
const { defaults, removeEmpties } = require('../util');

module.exports = init;

/*
 * https://www.geocod.io/docs/
 */

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
  const q = [];
  let verb;
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

const types = {
  county: 'administrative'
};

function map({
  address_components: {
    city,
    country,
    county,
    number: house,
    state,
    formatted_street: street
  },
  location: { lat, lng },
  name: place
}) {
  const res = {
    ll: [ lng, lat ],
    place,
    house,
    street,
    city,
    county,
    state,
    country: abbr2country[country] || country,
    type: 'address'
  };
  if (!res.house) {
    [
      'street',
      'city',
      'county',
      'state',
      'country'
    ].some(k => {
      if (res[k]) {
        res.type = types[k] || k;
        return true;
      }
    });
  }
  // remove empties
  return removeEmpties(res);
}

function processResponse(response, query, result) {
  result.places = response.results.map(map);
  return result;
}

function init(options) {
  options = defaults(options, {
    forward: true,
    reverse: true,
    url: getUrl.bind(undefined,
        options.geocodio_url || 'https://api.geocod.io/v1.7/',
        options.geocodio_key),
    status: getStatus,
    prepareRequest,
    processResponse
  });
  if (options.geocodio_parameters) {
    options = defaults(options, options.geocodio_parameters);
  }
  return require('..')(options);
}
