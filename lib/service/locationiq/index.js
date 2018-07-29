var normalize = require('../normalize');
var status = require('../status');
var util = require('../util');

module.exports = init;

/*
 * http://locationiq.org/docs
 */

function getStatus(err, response) {
  if (err) {
    return status.failure;
  }
  if (!response) {
    return status.error;
  }
  return status.success;
}

function getUrl(url, key, op, query) {
  var q = [];
  var verb;
  switch(op) {
    case 'forward':
      verb = 'search';
      q.push('q=' + encodeURIComponent(query.address || query.place));
      if (query.max) {
        q.push('limit=' + query.max);
      }
      if (query.bounds) {
        var box = [
          query.bounds[0][0], // left
          query.bounds[1][1], // top
          query.bounds[1][0], // right
          query.bounds[0][1]  // bottom
        ].join(',');
        q.push('viewbox=' + box);
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
  q.push("addressdetails=1");
  q.push("format=json");
  q.push('key=' + key);
  return url + verb + '.php?' + q.join('&');
}

function prepareRequest() {
  return true;
}

function map(f) {
  var a = f.address, place = {
    ll: [ parseFloat(f.lon), parseFloat(f.lat) ],
    place: f.display_name,
    street: a.road || a.pedestrian,
    town: a.city,
    province: normalize.state(a.state),
    country: normalize.country(a.country)
  };
  if (place.place) {
    place.address = place.place.split(',');
    place.place = place.address[0];
    if (!Object.keys(a).some(function (key) {
      if (a[key] === place.place) {
        place.type = key;
        return true;
      }
    })) {
      place.type = f.type || f.class;
    }
    if (place.type !== 'road') {
      place.address.shift();
    }
    place.address = normalize.address(place.address.join(',').trim(), place.province, place.country);
  }
  place.address = place.address || util.address(place);

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
        options.locationiq_url || 'https://us1.locationiq.org/v1/',
        options.locationiq_key),
    status: getStatus,
    prepareRequest: prepareRequest,
    processResponse: processResponse
  });
  if (options.locationiq_parameters) {
    options = util.defaults(options, options.locationiq_parameters);
  }
  return require('..')(options);
}
