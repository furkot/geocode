var status = require('../status');
var util = require('../util');

module.exports = init;

var provider = {
  hotel: 'hotels',
  fillingstation: 'mygasfeed'
};

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

function getUrl(url, op, query) {
  var q = [];
  switch(op) {
    case 'reverse':
      q.push('ll=' + query.ll.join(','));
      q.push('radius=100');
      q.push('provider=' + provider[query.type]);
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

function prepareRequest(op, query) {
  return Boolean(provider[query.type]);
}

function matchNames(n1, n2) {
  var n;
  if (n1.length > n2.length) {
    n = n1;
    n1 = n2;
    n2 = n;
  }
  n1 = n1.split(' ');
  return n1.some(function (n) {
    var result = this;
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
  var dist = Math.pow(result.ll[0] - place.ll[0], 2) + Math.pow(result.ll[1] - place.ll[1], 2);
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
  var place = response.reduce(findPlace, {
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
    place.address = util.address(place);
    result.places =  [ place ];
    return result;
  }
}

function init(options) {
  options = util.defaults(options, {
    reverse: true,
    url: getUrl.bind(undefined, options.hogfish_url),
    status: getStatus,
    prepareRequest: prepareRequest,
    processResponse: processResponse
  });
  return require('..')(options);
}
