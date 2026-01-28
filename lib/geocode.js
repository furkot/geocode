import geocodio from './service/geocodio/index.js';
import graphhopper from './service/graphhopper/index.js';
import hogfish from './service/hogfish/index.js';
import locationiq from './service/locationiq/index.js';
import maptiler from './service/maptiler/index.js';
import opencage from './service/opencage/index.js';
import pelias from './service/pelias/index.js';
import positionstack from './service/positionstack/index.js';
import synchronous from './service/synchronous/index.js';
import util from './service/util.js';

export default furkotGeocode;

//default timeout to complete operation
const defaultTimeout = 20 * 1000;
let id = 0;

function furkotGeocode(options) {
  const services = {
    geocodio: {
      init: geocodio
    },
    graphhopper: {
      init: graphhopper
    },
    hogfish: {
      init: hogfish
    },
    locationiq: {
      init: locationiq
    },
    opencage: {
      init: opencage
    },
    pelias: {
      init: pelias
    },
    positionstack: {
      init: positionstack
    },
    synchronous: {
      init: synchronous
    },
    maptiler: {
      init: maptiler
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
      if (
        service &&
        options[`${name}_enable`] &&
        (!options[`${name}_parameters`] || options[`${name}_parameters`][op] !== false)
      ) {
        if (!service.service) {
          const defaults = {
            name,
            limiter: options[`${name}_limiter`],
            enable: options[`${name}_enable`]
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
