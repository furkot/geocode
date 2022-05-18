const status = require('../status');
const { defaults, removeEmpties } = require('../util');
const { state: { state2abbr }} = require('@furkot/address');

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
  if (!(response.features && response.features.length)) {
    return status.empty;
  }
  return status.success;
}

function param(p) {
  return p.join('=');
}

function query(p) {
 return Object.entries(p).map(param, []).join('&');
}

function getUrl(url, key, op, { address, bounds, lang, ll, place }) {
  let q;
  if (op === 'forward') {
    q = encodeURIComponent(address || place);
  }
  else {
    q = ll.join(',');
  }
  const p = {
    key
  };
  if(lang && lang.length <= 2) {
    p.language = lang.substring(0, 2);
  }
  if (bounds) {
    p.bbox = bounds.map(ll => ll.join(',')).join(',');
  }
  return url + q + '.json?' + query(p);
}

function prepareRequest() {
  return true;
}

const types = {
  subcity: 'community'
};

function getType(tp) {
  return types[tp] || tp;
}

function processContext(res, { id, text }) {
  const key = getType(id.split('.')[0]);
  if (!res[key]) {
    res[key] = text;
  }
  return res;
}

function init(options) {

  function processResponse(response, query, result) {
    if (!(response && response.features && response.features.length)) {
      return;
    }
    result.places = response.features.map(({
      address,
      center,
      context,
      place_name,
      place_type,
      text
    }) => {
      const res = {
        ll: center
      };

      res.type = getType(place_type && place_type[0]);
      res.place = place_name;
      res.house = address;
      res[res.type] = text;
      if (context) {
        context.reduce(processContext, res);
      }
      if (res.state) {
        res.state = state2abbr[res.state] || res.state;
      }
      if (res.type === 'street' && res.house) {
        res.type = 'address';
      }
      return removeEmpties(res);
    });
    return result;
  }

  options = defaults(options, {
    forward: true,
    reverse: true,
    url: getUrl.bind(undefined,
        options.maptiler_url || 'https://api.maptiler.com/geocoding/',
        options.maptiler_key),
    status: getStatus,
    prepareRequest,
    processResponse
  });
  return require('..')(options);
}
