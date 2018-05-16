var strategy = require('./strategy');
var util = require('./service/util');

module.exports = furkotGeocode;

function skip(options, query, result) {
  // some other service already returned result
  // or service is disabled
  return result || !options.enable(query, result);
}

var services = {
  opencage: {
    init: require('./service/opencage')
  }
};

//default timeout to complete operation
var defaultTimeout = 20 * 1000;
var id = 0;

function furkotGeocode(options) {

  function geocode(query, fn) {
    var timeoutId, queryId, op;
    if (!query) {
      return fn();
    }
    op = query.ll ? 'reverse' : 'forward';
    if (!options[op]) {
      return fn();
    }

    id += 1;
    queryId = id;
    timeoutId = setTimeout(function () {
      timeoutId = undefined;
      // cancel outstanding requests
      options.abort.forEach(function (abort) {
        abort(queryId);
      });
    }, options.timeout);
    strategy(options[op], queryId, query, function (err, queryId, query, result) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
      if (err) {
        return fn();
      }
      fn(result);
    });
  }

  options = util.defaults(options, {
    timeout: defaultTimeout,
    order: ['opencage'],
    abort: [],
    skip: skip
  });
  ['forward', 'reverse'].reduce(function (options, op) {
    if (!options[op]) {
      options[op] = options.order.reduce(function (result, name) {
        var service = services[name];
        if (service && options[(name + '_enable')]) {
          if (!service.service) {
            service.service = service.init(util.defaults({
              name: name,
              limiter: options[(name + '_limiter')],
              enable: options[(name + '_enable')],
              skip: service.skip
            }, options));
            options.abort.push(service.service.abort);
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

  geocode.options = options;
  return geocode;
}
