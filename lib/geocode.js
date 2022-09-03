const util = require('./service/util');

module.exports = furkotGeocode;

//default timeout to complete operation
const defaultTimeout = 20 * 1000;
let id = 0;

function furkotGeocode(options) {
  const services = {
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
    pelias: {
      init: require('./service/pelias')
    },
    positionstack: {
      init: require('./service/positionstack')
    },
    synchronous: {
      init: require('./service/synchronous')
    },
    tilehosting: {
      init: require('./service/tilehosting')
    }
  };

  options = util.defaults(options, {
    timeout: defaultTimeout,
    order: ['opencage']
  });
  const operations = { ...options };
  ['forward', 'reverse'].forEach(op => {
    if (operations[op]) {
      return;
    }
    operations[op] = options.order.flatMap(name => {
      const service = services[options[name] || name];
      if (service && options[name + '_enable'] &&
        (!options[name + '_parameters'] || options[name + '_parameters'][op] !== false)) {
        if (!service.service) {
          const defaults = {
            name,
            limiter: options[(name + '_limiter')],
            enable: options[(name + '_enable')]
          };
          if (options[name]) {
            Object.keys(options).reduce(mapOptions, {
              options,
              name,
              optName: options[name],
              defaults
            });
          }
          service.service = service.init(util.defaults(defaults, options));
        }
        if (service.service[op] && service.service.geocode) {
          const operation = service.service.geocode.bind(undefined, op);
          operation.abort = service.service.abort;
          operation.provider = name;
          return [operation];
        }
      }
      return [];
    });
  });
  geocode.options = operations;
  return geocode;

  async function geocode(query, { signal } = {}) {
    if (!query) {
      return;
    }
    const op = query.ll ? 'reverse' : 'forward';
    if (!operations[op]?.length) {
      return;
    }
    if (signal) {
      signal.onabort = abort;
    }

    let aborted;
    let currentOperation;
    const queryId = ++id;
    query.max = query.max || options.max;

    return util.withTimeout(request(), options.timeout);

    async function request() {
      const stats = [];
      for (const operation of operations[op]) {
        stats.push(operation.provider);
        currentOperation = operation;
        const result = await operation(queryId, query);
        currentOperation = undefined;
        signal?.throwIfAborted();
        if (!result) {
          continue;
        }
        result.stats = stats;
        result.provider = operation.provider;
        if (result.places && (query.address || query.place)) {
          const places = result.places.filter(query.place ? isPlace : isAddress);
          if (places.length) {
            result.places = places;
          }
        }
        if (query.max > 0 && result.places?.length > query.max) {
          result.places.length = query.max;
        }
        return result;
      }
    }

    function abort() {
      if (!aborted) {
        aborted = true;
        // cancel outstanding request
        currentOperation?.abort?.(queryId);
      }
    }
  }
}

function isPlace(place) {
  return place.place || !place.street;
}

function isAddress(place) {
  return !place.place;
}

function mapOptions(result, opt) {
  if (opt.startsWith(result.name)) {
    result.defaults[opt.replace(result.name, result.optName)] = result.options[opt];
  }
  return result;
}
