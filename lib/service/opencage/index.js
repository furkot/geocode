var status = require('../status');
var util = require('../util');

var code2status = {
  200: status.success, // OK (zero or more results will be returned)
  400: status.empty,   // Invalid request (bad request; a required parameter is missing; invalid coordinates)
  402: status.failure, // Valid request but quota exceeded (payment required)
  403: status.failure, // Invalid or missing api key (forbidden)
  404: status.failure, // Invalid API endpoint
  408: status.error,   // Timeout; you can try again
  410: status.empty,   // Request too long
  429: status.error,   // Too many requests (too quickly, rate limiting)
  503: status.empty    // Internal server error
};

var geotypes = [
  'road',
  'neighbourhood',
  'suburb',
  'town',
  'city',
  'county',
  'state',
  'country'
].reduce(function (result, type) {
  result[type] = type;
  return result;
}, {});

module.exports = init;

// response codes: https://geocoder.opencagedata.com/api#codes
function getStatus(err, response) {
  var code = response && response.status && response.status.code;
  if (!response) {
    return;
  }
  code = code2status[code];
  if (code === status.success && !(response.results && response.results.length)) {
    code = status.empty;
  }
  return code || status.error;
}

function getUrl(url, key, op, query) {
  var q;
  if (op === 'forward') {
    q = (query.address || query.place).replace(/ /g, '+').replace(/,/g, '%2C');
  }
  else {
    q = query.ll[1] + '+' + query.ll[0];
  }
  url += '?q=' + q;
  if (query.bounds) {
    url += '&bounds=' + query.bounds.map(join).join(',');
  }
  if (query.lang) {
    url += '&language=' + query.lang;
  }
  url += '&no_annotations=1';
  return url + '&key=' + key;
}

function prepareRequest() {
  return true;
}

function init(options) {

  function processResponse(response, query, result) {
    if (!(response && response.results && response.results.length)) {
      return;
    }
    result.places = response.results.map(function (result) {
      var components = result.components, geom = result.geometry, res = {
          ll: [ geom.lng, geom.lat ]
      }, addr;
      if (components._type) {
        res.type = components._type;
      }
      if (components[components._type]) {
        res.place = components[components._type];
      }
      if (components.house_number) {
        res.house = components.house_number;
      }
      if (components.road || components.pedestrian) {
        res.street = components.road || components.pedestrian;
      }
      if (components.neighbourhood || components.village) {
        res.community = components.neighbourhood || components.village;
      }
      if (components.town || components.city) {
        res.town = components.town || components.city;
      }
      if (components.county) {
        res.county = components.county;
      }
      if (components.state_code) {
        res.province = components.state_code;
      }
      if (components.country) {
        res.country = components.country;
        if (res.country === 'United States of America') {
          res.country = 'USA';
        }
      }
      if (result.formatted) {
        res.address = result.formatted;
        if (!geotypes[res.type]) {
          addr = res.address.split(', ');
          if (addr.length > 1 && addr[0] === res.place) {
            addr.shift();
            res.address = addr.join(', ');
          }
        }
        if (res.country === 'USA') {
          res.address = res.address.replace('United States of America', 'USA');
        }
      }
      return res;
    });
    return result;
  }

  options = util.defaults(options, {
    forward: true,
    reverse: true,
    url: getUrl.bind(undefined,
        options.opencage_url || 'https://api.opencagedata.com/geocode/v1/json',
        options.opencage_key),
    status: getStatus,
    prepareRequest: prepareRequest,
    processResponse: processResponse
  });
  if (options.opencage_parameters) {
    options = util.defaults(options, options.opencage_parameters);
  }
  return require('..')(options);
}

function join(ll) {
  return ll.join(',');
}
