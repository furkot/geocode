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
      break;
      case 'forward':
        q.push('q=' + encodeURIComponent(query.place || query.address));
        if (query.bounds) {
          q.push('sw=' + query.bounds[0].join(','));
          q.push('ne=' + query.bounds[1].join(','));
        }
        break;
      default:
      // invalid operation
      return;
  }
  q.push(...types[query.type]);
  if (query.max) {
    q.push('limit=' + query.max);
  }
  return url + '?' + q.join('&');
}

function prepareRequest(types, op, query) {
  if (op === 'forward') {
    query.type = query.type ?? ['place', 'address'].find(type => query.hasOwnProperty(type));
  }
  return Boolean(types[query.type]);
}

function matchNames(n1, n2) {
  if (n1.length > n2.length) {
    const n = n1;
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
    place.type = result.type;
    result[0] = place;
  }
  return result;
}

function map(f) {
  const place = {
    ll: f.ll,
    place: f.name,
    url: f.url,
    street: f.address,
    town: f.city,
    province: f.state,
    country: f.country,
    type: f.type,
    service: f.service
  };

  // remove empties
  return util.removeEmpties(place);
}

function filterResponse(query, response) {
  if (!(query.ll && query.type)) {
    return response;
  }
  const places = [];
  places.type = query.type;
  places.place = query.place;
  places.ll = query.ll;
  return response.reduce(findPlace, places);
}

function processResponse(response, query, result) {
  result.places = filterResponse(query, response).map(map);
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
