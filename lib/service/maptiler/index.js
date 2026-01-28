import initService from '../index.js';
import normalize from '../normalize.js';
import status from '../status.js';
import util from '../util.js';

export default init;

/*
 * https://docs.maptiler.com/cloud/api/geocoding/
 */
function getStatus(err, response) {
  if (!response) {
    return;
  }
  if (err) {
    return err.status ? status.error : status.failure;
  }
  if (!(response.type === 'FeatureCollection' && response.features?.length)) {
    return status.empty;
  }
  return status.success;
}

function getUrl(url, key, op, query) {
  let q;
  if (op === 'forward') {
    q = encodeURIComponent(query.address || query.place);
  } else {
    q = query.ll.join(',');
  }
  q += `.json?key=${key}`;
  if (query.max) {
    q += `&limit=${query.max}`;
  }
  if (query.bounds) {
    q +=
      '&bbox=' +
      [
        query.bounds[0][0], // west
        query.bounds[0][1], // south
        query.bounds[1][0], // east
        query.bounds[1][1] // north
      ].join(',');
  }
  return url + q;
}

function prepareRequest() {
  return true;
}

function map(result) {
  const res = {
    ll: result.center
  };

  res.place = result.text;
  res.house = result.address;
  if (result.properties) {
    res.type = result.properties.kind;
    res.country = normalize.country(result.properties.country_code?.toUpperCase());
  }
  res.address = result.place_name;
  if (res.street !== res.place) {
    const addr = res.address.split(', ');
    if (addr.length > 1 && addr[0] === res.place) {
      addr.shift();
      res.address = addr.join(', ');
    }
  }
  // remove empties
  return util.removeEmpties(res);
}

function processResponse(response, _query, result) {
  if (!(response?.type === 'FeatureCollection' && response?.features?.length)) {
    return;
  }
  result.places = response.features.map(map);
  return result;
}

function init(options) {
  options = util.defaults(options, {
    forward: true,
    reverse: true,
    url: getUrl.bind(undefined, options.maptiler_url || 'https://api.maptiler.com/geocoding/', options.maptiler_key),
    status: getStatus,
    prepareRequest,
    processResponse
  });
  return initService(options);
}
