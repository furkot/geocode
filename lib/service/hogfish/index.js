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
    case 'forward':
      q.push('q=' + encodeURIComponent(query.place));
      q.push('sw=' + query.bounds[0].join(','));
      q.push('ne=' + query.bounds[1].join(','));
      // HACK: we should use the same URL
      url = util.replaceUrlPath(url, '/api/place');
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
  return op === 'forward' || Boolean(types[query.type]);
}

function matchNames(n1, n2) {
  if (n1.length > n2.length) {
    let n = n1;
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

function normalizePlace(item) {
  const place = {
    ll: item.ll,
    place: item.name,
    url: item.url,
    street: item.address,
    town: item.city,
    county: item.county,
    province: item.state,
    country: item.country
  };
  place.address = util.address(place);

  // remove empties
  return util.removeEmpties(place);
}

function processResponse(response, query, result) {
  if (query.ll) {
    const item = response.reduce(findPlace, {
      place: query.place,
      ll: query.ll
    }).found;
    if (!item) {
      return;
    }
    const place = normalizePlace(item);
    place.type = query.type;
    place.service = item.service;
    result.places = [place];
  } else {
    result.places = response.map(normalizePlace);
  }
  return result;
}

function init(options) {
  if (options.hogfish_parameters) {
    options = util.defaults(options, options.hogfish_parameters);
  }
  options = util.defaults(options, {
    reverse: true,
    forward: true,
    url: getUrl.bind(undefined, options.hogfish_url, options.types),
    status: getStatus,
    prepareRequest: prepareRequest.bind(undefined, options.types),
    processResponse
  });
  return require('..')(options);
}
