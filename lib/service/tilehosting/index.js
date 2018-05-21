/*
 * https://cloud.maptiler.com/geocoding/
 */
var states = require('../states');
var status = require('../status');
var util = require('../util');

module.exports = init;

// response codes: https://geocoder.opencagedata.com/api#codes
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
  var q;
  if (op === 'forward') {
    q = 'q/' + encodeURIComponent(query.address || query.place);
  }
  else {
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
      var res = {
          ll: [ result.lon, result.lat ]
      }, addr;
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
        res.province = states[result.state] || result.state;
      }
      if (result.country) {
        res.country = result.country;
        if (res.country === 'United States of America') {
          res.country = 'USA';
        }
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
        if (res.country === 'USA') {
          res.address = res.address.replace('United States of America', 'USA');
        }
        if (res.country === 'USA' || res.coutry === 'Canada') {
          res.address = res.address.replace(result.state, res.province);
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
    prepareRequest: prepareRequest,
    processResponse: processResponse
  });
  return require('..')(options);
}
