const status = require('../status');
const util = require('../util');

module.exports = init;

function getStatus(err, response) {
  if (err) {
    return status.failure;
  }
  if (!response) {
    return status.error;
  }
  if (response.length === 0) {
    return status.empty;
  }
  return status.success;
}

function getUrl(url, types, op, query) {
  const q = [];
  switch (op) {
    case 'reverse':
      q.push('ll=' + query.ll.join(','));
      q.push('radius=100');
      q.push(...types[query.type]);
      break;
    default:
      // invalid operation
      return;
  }
  if (query.max) {
    q.push('limit=' + query.max);
  }
  return url + '?' + q.join('&');
}

function prepareRequest(types, op, query) {
  return Boolean(types[query.type]);
}

function matchNames(n1, n2) {
  let n;
  if (n1.length > n2.length) {
    n = n1;
    n1 = n2;
    n2 = n;
  }
  n1 = n1.split(' ');
  return n1.some(function (n) {
    const result = this;
    if (result.name.indexOf(n) > -1) {
      result.words -= 1;
      if (!result.words) {
        return true;
      }
    }
  }, {
    name: n2,
    words: Math.min(n1.length, 2)
  });
}

function isCloser(result, place) {
  const dist = Math.pow(result.ll[0] - place.ll[0], 2) + Math.pow(result.ll[1] - place.ll[1], 2);
  if (result.distance === undefined || dist < result.distance) {
    result.distance = dist;
    return true;
  }
}

function findPlace(result, place) {
  if ((!result.place || (place.name && matchNames(place.name, result.place))) &&
    isCloser(result, place)) {
    result.found = place;
  }
  return result;
}

function processResponse(response, query, result) {
  let place = response.reduce(findPlace, {
    place: query.place,
    ll: query.ll
  }).found;
  if (place) {
    place = {
      ll: place.ll,
      place: place.name,
      url: place.url,
      street: place.address,
      town: place.city,
      province: place.state,
      country: place.country,
      type: query.type,
      service: place.service
    };
    result.places = [place];
    return result;
  }
}

function init(options) {
  if (options.hogfish_parameters) {
    options = util.defaults(options, options.hogfish_parameters);
  }
  options = util.defaults(options, {
    reverse: true,
    url: getUrl.bind(undefined, options.hogfish_url, options.types),
    status: getStatus,
    prepareRequest: prepareRequest.bind(undefined, options.types),
    processResponse
  });
  return require('..')(options);
}
