var strategy = require('./strategy');
var util = require('./service/util');

module.exports = furkotGeocode;

function skip(options, query, result) {
  // some other service already returned result
  // or service is disabled
  return (result && result.places && result.places.length) || !options.enable(query, result);
}

//default timeout to complete operation
var defaultTimeout = 20 * 1000;
var id = 0;

function furkotGeocode(options) {
  var services = {
    algolia: {
      init: require('./service/algolia')
    },
    geocodio: {
      init: require('./service/geocodio')
    },
    graphhopper: {
      init: require('./service/graphhopper')
    },
    hogfish: {
      init: require('./service/hogfish')
    },
    locationiq: {
      init: require('./service/locationiq')
    },
    opencage: {
      init: require('./service/opencage')
    },
    openroute: {
      init: require('./service/openroute')
    },
    tilehosting: {
      init: require('./service/tilehosting')
    }
  }, operations;

  function geocode(query, fn) {
    var timeoutId, queryId, op, aborted;

    function abort() {
      aborted = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
      // cancel outstanding requests
      operations.abort.forEach(function (abort) {
        abort(queryId);
      });
    }

    if (!query) {
      fn();
      return;
    }
    op = query.ll ? 'reverse' : 'forward';
    if (!(operations[op] && operations[op].length)) {
      fn();
      return;
    }

    id += 1;
    queryId = id;
    timeoutId = setTimeout(abort, options.timeout);
    query.max = query.max || options.max;
    strategy(operations[op], queryId, query, {}, function (err, queryId, query, result) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
      if (err || aborted) {
        return fn();
      }
      if (result && result.places && (query.address || query.place)) {
        var places = result.places.filter(query.place ? isPlace : isAddress);
        if (places.length) {
          result.places = places;
        }
      }
      if (query.max && result && result.places && result.places.length > query.max) {
        result.places.length = query.max;
      }
      fn(result);
    });
    return {
      abort: abort
    };
  }

  options = util.defaults(options, {
    timeout: defaultTimeout,
    order: ['opencage'],
    skip: skip
  });
  operations = util.defaults(options, {
    abort: []
  });
  ['forward', 'reverse'].reduce(function (options, op) {
    if (!operations[op]) {
      operations[op] = options.order.reduce(function (result, name) {
        var service = services[name];
        if (service && options[name + '_enable'] &&
            (!options[name + '_parameters'] || options[name + '_parameters'][op] !== false)) {
          if (!service.service) {
            service.service = service.init(util.defaults({
              name: name,
              limiter: options[(name + '_limiter')],
              enable: options[(name + '_enable')],
              skip: service.skip
            }, options));
            operations.abort.push(service.service.abort);
          }
          if (service.service[op] && service.service.geocode) {
            result.push(service.service.geocode.bind(undefined, op));
          }
        }
        return result;
      }, []);
    }
    return options;
  }, options);

  geocode.options = operations;
  return geocode;
}

function isPlace(place) {
  return place.place || !place.street;
}

function isAddress(place) {
  return !place.place;
}
