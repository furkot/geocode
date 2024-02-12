const fetchagent = require('fetchagent');
const makeLimiter = require('limiter-component');
const debug = require('debug')('furkot:geocode:service');

const status = require('./status');
const util = require('./util');

module.exports = init;

const limiters = {};

const ABORT_TO_FAILURE = 3; // max number of aborted requests before shutting down service

function request(url, req, fn) {
  const options = this;
  let fa = fetchagent;
  if (options.post) {
    fa = fa.post(url).send(req);
  } else {
    fa = fa.get(url).query(req);
  }
  return fa
    .set('accept', 'application/json')
    .end(fn);
}

function initUrl(url) {
  return typeof url === 'function' ? url : () => url;
}

function init(options) {
  let holdRequests;
  let abortCounter = 0;
  const outstanding = {};

  options = util.defaults(options, {
    interval: 340,
    penaltyInterval: 2000,
    limiter: limiters[options.name],
    request,
    abort
  });
  options.url = initUrl(options.url);
  limiters[options.name] = options.limiter || makeLimiter(options.interval, options.penaltyInterval);
  const limiter = limiters[options.name];

  return {
    forward: options.forward,
    reverse: options.reverse,
    geocode,
    abort: options.abort
  };

  function abort(queryId) {
    debug('abort', queryId);
    if (!outstanding[queryId]) {
      return;
    }
    const { laterTimeoutId, reqInProgress} = outstanding[queryId];
    // cancel later request if scheduled
    if (laterTimeoutId) {
      clearTimeout(laterTimeoutId);
    }
    // cancel request in progress
    reqInProgress?.abort?.();
    abortCounter += 1;
    if (abortCounter >= ABORT_TO_FAILURE) {
      // don't ever ask again
      holdRequests = true;
    }
    outstanding[queryId].resolveOnAbort();
  }

  function geocode(op, queryId, query) {
    const fns = {};
    const promise = new Promise(resolve => fns.resolve = resolve);

    outstanding[queryId] = { resolve, resolveOnAbort };
    executeQuery();
    return promise;

    function resolve(result) {
      abortCounter = 0;
      delete outstanding[queryId];
      fns.resolve(result);
    }

    function resolveOnAbort() {
      delete outstanding[queryId];
      fns.resolve();
    }

    function requestLater() {
      outstanding[queryId].laterTimeoutId = setTimeout(function () {
        if (outstanding[queryId]) {
          delete outstanding[queryId].laterTimeoutId;
        }
        executeQuery();
      }, options.penaltyTimeout);
    }

    function executeQuery() {
      if (!outstanding[queryId]) {
        // query has been aborted
        return;
      }

      const { resolve } = outstanding[queryId];
      if (holdRequests) {
        return resolve();
      }
      if (options.enable && !options.enable(query)) {
        return resolve();
      }
      let req = options.prepareRequest(op, query);
      if (!req) {
        return resolve();
      }
      if (req === true) {
        req = undefined;
      }

      limiter.trigger(executeQueryTriggered);

      function executeQueryTriggered() {
        if (!outstanding[queryId]) {
          // query has been aborted
          limiter.skip(); // immediately process the next request in the queue
          return;
        }
        outstanding[queryId].reqInProgress = options.request(options.url(op, query), req, function (err, response) {
          if (!outstanding[queryId]) {
            // query has been aborted
            return;
          }
          delete outstanding[queryId].reqInProgress;
          switch (options.status(err, response)) {
            case status.success:
              const res = options.processResponse(response, query, {});
              res.places?.forEach(p => { p.normal = util.stringify(p) || ''; p.address = util.prettify(p.normal); });
              resolve(res);
              break;
            case status.failure:
              // don't ever ask again
              holdRequests = true;
              resolve();
              break;
            case status.error:
              // try again later
              limiter.penalty();
              requestLater();
              break;
            default:
              resolve();
              break;
          }
        });
      }
    }
  }
}
