var states = require('../states');
var status = require('../status');
var util = require('../util');

module.exports = init;

function getUrl(url, key, id) {
  if (key && id) {
    url += '?x-algolia-api-key=' + key + '&x-algolia-application-id=' + id;
  }
  return url;
}

function prepareRequest(op, query) {
  var req = {
    query: query.address || query.place,
    aroundLatLngViaIP: false
  };
  if (query.bounds) {
    req.aroundLatLng = mid(query.bounds[0][1], query.bounds[1][1]) +
      ',' + mid(query.bounds[0][0], query.bounds[0][1]);
  }
  if (query.address) {
    req.type = 'address';
  }
  if (query.lang) {
    req.language = query.lang.split('_').pop();
  }
  return req;
}

function getStatus(err, response) {
  if (!(response && response.nbHits)) {
    return status.empty;
  }
  return status.success;
}

function processResponse(response, query, result) {
  if (!(response && response.hits && response.hits.length)) {
    return;
  }
  result.places = response.hits.map(function (result) {
    var geom = result._geoloc, res = {
      ll: [ geom.lng, geom.lat ]
    }, addr = [];
    if (result.is_highway) {
      res.type = 'road';
    }
    else if (result._tags && result._tags.length){
      res.type = result._tags[0];
    }
    if (result.locale_names && result.locale_names.length) {
      if (res.type === 'road') {
        res.street = result.locale_names[0];
        addr.push(res.street);
      }
      else {
        res.place = result.locale_names[0];
      }
    }
    if (result.city && result.city.length) {
      res.town = result.city[0];
      addr.push(res.town);
    }
    if (result.county && result.county.length) {
      res.county = result.county[0];
      if (!res.town) {
        addr.push(res.county);
      }
    }
    if (result.administrative && result.administrative.length) {
      res.province = states[result.administrative[0]] || result.administrative[0];
      addr.push(res.province);
    }
    if (result.country) {
      res.country = result.country;
      if (res.country === 'United States of America') {
        res.country = 'USA';
      }
      addr.push(res.country);
    }
    res.address = addr.join(', ');
    return res;
  });
  return result;
}

function init(options) {

  if (options.algolia_parameters) {
    options = util.defaults(options, options.algolia_parameters);
  }
  options = util.defaults(options, {
    forward: true,
    post: true,
    url: getUrl(options.algolia_url || 'https://places-dsn.algolia.net/1/places/query',
      options.algolia_key,
      options.algolia_app_id),
    status: getStatus,
    prepareRequest: prepareRequest,
    processResponse: processResponse
  });
  return require('..')(options);
}

function mid(v1, v2) {
  return (v1 + v2) / 2;
}