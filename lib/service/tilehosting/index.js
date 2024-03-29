const normalize = require('../normalize');
const status = require('../status');
const util = require('../util');

module.exports = init;

/*
 * https://cloud.maptiler.com/geocoding/
 */
function getStatus(err, response) {
  if (!response) {
    return;
  }
  if (err) {
    return err.status ? status.error : status.failure;
  }
  if (!(response.results && response.results.length)) {
    return status.empty;
  }
  return status.success;
}

function getUrl(url, key, op, query) {
  let q;
  if (op === 'forward') {
    q = 'q/' + encodeURIComponent(query.address || query.place);
  } else {
    q = 'r/' + query.ll.join('/');
  }
  return url + q + '.js?key=' + key;
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
      const res = {
        ll: [result.lon, result.lat]
      };

      let addr;
      if (result.type) {
        res.type = result.type;
      }
      if (result.name) {
        res.place = result.name;
      }
      if (result.housenumbers) {
        res.house = result.housenumbers.split(', ').shift();
      }
      if (result.street) {
        res.street = result.street;
      }
      if (result.city) {
        res.town = result.city;
      }
      if (result.county) {
        res.county = result.county;
      }
      if (result.state) {
        res.province = normalize.state(result.state);
      }
      if (result.country) {
        res.country = normalize.country(result.country);
      }
      if (result.display_name) {
        res.address = result.display_name;
        if (res.street !== res.place) {
          addr = res.address.split(', ');
          if (addr.length > 1 && addr[0] === res.place) {
            addr.shift();
            res.address = addr.join(', ');
          }
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
      options.tilehosting_url || 'https://geocoder.tilehosting.com/',
      options.tilehosting_key),
    status: getStatus,
    prepareRequest,
    processResponse
  });
  return require('..')(options);
}
