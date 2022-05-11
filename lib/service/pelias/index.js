const normalize = require('../normalize');
const status = require('../status');
const util = require('../util');

module.exports = init;

/*
 * https://github.com/pelias/documentation/blob/master/search.md#search-the-world
 * https://github.com/pelias/documentation/blob/master/reverse.md#reverse-geocoding
 */

function getStatus(err, response) {
  if (err && !response) {
    return status.failure;
  }
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

https://api.openrouteservice.org/geocode/search?api_key=${API_KEY}&text=SS%20So%C5%82dek"
https://api.openrouteservice.org/geocode/autocomplete?api_key=${API_KEY}&text=SS%20So%C5%82dek"
https://api.openrouteservice.org/geocode/reverse?api_key=${API_KEY}&point.lat=-22.6792&point.lon=14.5272"

*/

function getUrl(url, key, enablePartial, op, query) {
  const q = [];
  let suffix;
  switch(op) {
    case 'forward':
      suffix = query.partial && enablePartial ? '/autocomplete' : '/search';
      q.push(`text=${encodeURIComponent(query.address || query.place)}`);
      if (query.bounds) {
        const [ sw, ne ] = query.bounds;
        q.push(
          `boundary.rect.min_lon=${sw[0]}`,
          `boundary.rect.min_lat=${sw[1]}`,
          `boundary.rect.max_lon=${ne[0]}`,
          `boundary.rect.max_lat=${ne[1]}`
        );
        if (query.address) {
          q.push('layers=address');
        }
        else {
          q.push('layers=venue,coarse');
        }
      }
      break;
    case 'reverse':
      suffix = '/reverse';
      q.push(
        `point.lon=${query.ll[0]}`,
        `point.lat=${query.ll[1]}`
      );
      break;
    default:
      // invalid operation
      return;
  }
  if (query.max) {
    q.push(`size=${query.max}`);
  }
  if (query.lang) {
    const lang = query.lang.toLowerCase().split('_').join('-');
    q.push(`lang=${lang}`);
  }
  q.push(`api_key=${key}`);
  return url + suffix + '?' + q.join('&');
}

function prepareRequest() {
  return true;
}

function filter(f) {
  return f.type === 'Feature' && f.geometry && f.geometry.type === 'Point';
}

function map(f) {
  const p = f.properties;
  const place = {
    ll: f.geometry.coordinates,
    type: p.layer,
    street: p.street,
    town: p.locality,
    county: p.county,
    province: normalize.state(p.region),
    country: normalize.country(p.country)
  };
  if (p.housenumber && place.street) {
    place.street = [p.housenumber, place.street].join(' ');
  }
  if (place.type === 'venue') {
    place.place = p.name;
  }
  place.address = util.address(place);

  // remove empties
  return util.removeEmpties(place);
}

function processResponse({ features }, query, result) {
  result.places = features.filter(filter).map(map);
  return result;
 }

function init(options) {
  options = util.defaults(options, {
    forward: true,
    reverse: true,
    url: getUrl.bind(undefined,
        options.pelias_url || 'https://api.openrouteservice.org/geocode',
        options.pelias_key,
        options.pelias_parameters && options.pelias_parameters.enablePartial),
    status: getStatus,
    prepareRequest,
    processResponse
  });
  if (options.pelias_parameters) {
    options = util.defaults(options, options.pelias_parameters);
  }
  return require('..')(options);
}
