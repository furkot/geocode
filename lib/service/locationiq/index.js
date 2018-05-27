var status = require('../status');
var util = require('../util');

module.exports = init;

function getStatus(err, response) {
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
  var place = {
    ll: [ parseFloat(f.lon), parseFloat(f.lat) ],
    place: f.display_name,
    type: f.type,
    street: f.address.road || f.address.pedestrian,
    town: f.address.city,
    province: f.address.state,
    country: f.address.country
  };
  place.address = [ place.street, place.town, place.country ]
    .filter(function(s) { return s; })
    .join(', ');

  // remove empties
  Object.keys(place).forEach(function(key) {
    if (place[key] == null) {
      delete place[key];
    }
  });

  return place;
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
