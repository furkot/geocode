var status = require('../status');
var util = require('../util');

module.exports = init;

function getStatus(err, response) {
  if (!response) {
    return status.error;
  }
  if (!response.hits || response.hits.length === 0) {
    return status.empty;
  }
  return status.success;
}

function getUrl(url, key, op, query) {
  var q = [];
  switch(op) {
    case 'forward':
      q.push('q=' + encodeURIComponent(query.address || query.place));
      if (query.bounds) {
        var ll = [
          (query.bounds[0][0] + query.bounds[1][0]) / 2,
          (query.bounds[0][1] + query.bounds[1][1]) / 2
        ];
        q.push('point=' + ll[1] + ',' + ll[0]); // latitude, longitude
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

function map(f) {
  var place = {
    ll: [f.point.lng, f.point.lat],
    place: f.name,
    type: f.osm_value,
    housenumber: f.housenumber,
    street: f.street,
    town: f.city,
    province: f.state,
    country: f.country
  };
  place.address = [ f.street, f.city, f.country ]
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

function processResponse(response, query, result) {
  var hits = response.hits;
  result.places = hits.map(map);
  return result;
 }

function init(options) {
  options = util.defaults(options, {
    forward: true,
    reverse: true,
    url: getUrl.bind(undefined,
        options.graphhopper_url || 'https://graphhopper.com/api/1/geocode',
        options.graphhopper_key),
    status: getStatus,
    prepareRequest: prepareRequest,
    processResponse: processResponse
  });
  if (options.graphhopper_parameters) {
    options = util.defaults(options, options.graphhopper_parameters);
  }
  return require('..')(options);
}
