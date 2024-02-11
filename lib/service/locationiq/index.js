const normalize = require('../normalize');
const status = require('../status');
const util = require('../util');

module.exports = init;

/*
 * https://locationiq.org/docs
 */

const DEFAULT_URL = 'api.locationiq.com';

function getStatus(err, response) {
  if (err) {
    if (err.status === 401 ||
      (err.status === 429 && response.error === 'Rate Limited Day')) {
      return status.failure;
    }
    if (err.status === 429 || err.status === 500) {
      return status.error;
    }
    return status.empty;
  }
  if (!response) {
    return status.empty;
  }
  return status.success;
}

function getUrl(url, key, op, query) {
  const q = [];
  let verb;
  switch (op) {
    case 'forward':
      verb = 'search';
      q.push('q=' + encodeURIComponent(query.address || query.place));
      if (query.max) {
        q.push('limit=' + query.max);
      }
      if (query.bounds) {
        const box = [
          query.bounds[0][0], // left
          query.bounds[0][1], // bottom
          query.bounds[1][0], // right
          query.bounds[1][1] // top
        ].join(',');
        q.push('viewbox=' + box);
        q.push('bounded=1');
      }
      break;
    case 'reverse':
      verb = 'reverse';
      q.push('lon=' + query.ll[0]);
      q.push('lat=' + query.ll[1]);
      break;
    default:
      // invalid operation
      return;
  }
  if (query.lang) {
    q.push('accept-language=' + query.lang);
  }
  q.push('addressdetails=1');
  q.push('normalizecity=1');
  q.push('format=json');
  q.push('key=' + key);
  if (query.partial) {
    url = url
      .replace('us1.locationiq.com', DEFAULT_URL)
      .replace('eu1.locationiq.com', DEFAULT_URL);
  }
  return url + verb + '.php?' + q.join('&');
}

function prepareRequest() {
  return true;
}

function getType(key) {
  const a = this.a;
  const place = this.place;
  if (a[key] === place.place) {
    place.type = key;
    return true;
  }
}

function map(f) {
  const a = f.address;

  const place = {
    ll: [parseFloat(f.lon), parseFloat(f.lat)],
    house: a.house_number,
    street: a.road || a.pedestrian,
    town: a.city,
    province: normalize.state(a.state),
    country: normalize.country(a.country)
  };

  place.address = util.address(place);
  if (f.display_name) {
    place.place = f.display_name.split(',')[0];
    if (!(place.place && Object.keys(a).some(getType, {
        a,
        place
      }))) {
      place.type = f.type || f.class;
    }
    if (place.place === a.house_number ||
      place.place === place.street ||
      place.place === (a.road || a.pedestrian)) {
      delete place.place;
    }
  }

  // remove empties
  return util.removeEmpties(place);
}

function processResponse(places, query, result) {
  if (!Array.isArray(places)) {
    places = [places];
  }
  result.places = places.map(map);
  return result;
}

function init(options) {
  options = util.defaults(options, {
    forward: true,
    reverse: true,
    url: getUrl.bind(undefined,
      options.locationiq_url || 'https://' + DEFAULT_URL + '/v1/',
      options.locationiq_key),
    status: getStatus,
    prepareRequest,
    processResponse
  });
  if (options.locationiq_parameters) {
    options = util.defaults(options, options.locationiq_parameters);
  }
  return require('..')(options);
}
