const normalize = require('../normalize');
const status = require('../status');
const util = require('../util');

module.exports = init;

/*
 * https://positionstack.com/documentation
 */

function getStatus(err, response) {
  if (!(response && response.data && response.data.length > 0)) {
    return status.empty;
  }
  return status.success;
}

function getUrl(url, key, unrestricted, op, query) {
  const q = [];
  let suffix;
  switch (op) {
    case 'forward':
      suffix = '/forward';
      q.push(`query=${encodeURIComponent(query.address || query.place)}`);
      break;
    case 'reverse':
      suffix = '/reverse';
      q.push(`query=${query.ll[1]},${query.ll[0]}`);
      break;
    default:
      // invalid operation
      return;
  }
  if (query.max) {
    q.push(`limit=${query.max}`);
  }
  if (query.lang && unrestricted) {
    const lang = query.lang.toLowerCase().split(/_|-/)[0];
    q.push(`language=${lang}`);
  }
  q.push(`access_key=${key}`);
  return url + suffix + '?' + q.join('&');
}

function prepareRequest() {
  return true;
}

function guessCity({ label, name, region_code, type }) {
  const labelWithoutName = label.replace(name, '').split(',').find(t => t.trim());
  if (labelWithoutName) {
    const city = labelWithoutName.trim();
    if (city !== region_code) {
      return city;
    }
  }
  if (type === 'locality') {
    return name;
  }
}

function map(f) {
  const place = {
    ll: [f.longitude, f.latitude],
    type: f.type,
    house: f.number,
    street: f.street,
    town: guessCity(f),
    province: normalize.state(f.region) || f.region_code,
    country: normalize.country(f.country)
  };
  if (f.type === 'address') {
    place.address = f.label;
  } else {
    place.place = f.name;
    place.address = util.address(place);
  }

  // remove empties
  return util.removeEmpties(place);
}

function processResponse(response, query, result) {
  const { data } = response;
  result.places = data.map(map);
  return result;
}

function init(options) {
  const url = options.positionstack_url || 'http://api.positionstack.com/v1';
  options = util.defaults(options, {
    forward: true,
    reverse: true,
    url: getUrl.bind(undefined,
      url,
      options.positionstack_key,
      url.startsWith('https:')),
    status: getStatus,
    prepareRequest,
    processResponse
  });
  if (options.positionstack_parameters) {
    options = util.defaults(options, options.positionstack_parameters);
  }
  return require('..')(options);
}
