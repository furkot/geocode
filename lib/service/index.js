var fetchagent = require('fetchagent');
var status = require('./status');
var util = require('./util');
var debug = require('debug')('furkot:geocode:service');

module.exports = init;

var limiters = {};

const ERROR = 'input error';
const ABORT_TO_FAILURE = 3; // max number of aborted requests before shutting down service

function request(url, req, fn) {
  var options = this, fa = fetchagent;
  if (options.post) {
    fa = fa.post(url).send(req);
  }
  else {
    fa = fa.get(url).query(req);
  }
  return fa
    .set('accept', 'application/json')
    .end(fn);
}

function initUrl(url) {
  if (typeof url === 'function') {
    return url;
  }
  return function () {
    return url;
  };
}

function init(options) {
  var limiter, holdRequests, abortCounter = 0, outstanding = {};

  function abort(queryId) {
    debug('abort', queryId);
    if (!outstanding[queryId]) {
      return;
    }
    // cancel later request if scheduled
    if (outstanding[queryId].laterTimeoutId) {
      clearTimeout(outstanding[queryId].laterTimeoutId);
    }
    // cancel request in progress
    if (outstanding[queryId].reqInProgress) {
      outstanding[queryId].reqInProgress.abort();
    }
    abortCounter += 1;
    if (abortCounter >= ABORT_TO_FAILURE) {
      // don't ever ask again
      holdRequests = true;
    }
    outstanding[queryId].callback(ERROR);
  }

  function geocode(op, queryId, query, result, fn) {

    function requestLater() {
      outstanding[queryId].laterTimeoutId = setTimeout(function () {
        if (outstanding[queryId]) {
          delete outstanding[queryId].laterTimeoutId;
        }
        executeQuery();
      }, options.penaltyTimeout);
    }

    function executeQuery(callback) {
      var req;

      if (!outstanding[queryId]) {
        // query has been aborted
        return;
      }
      if (holdRequests) {
        return callback();
      }
      if (options.enable && !options.enable(query)) {
        return callback();
      }
      req = options.prepareRequest(op, query);
      if (!req) {
        return callback();
      }
      if (req === true) {
        req = undefined;
      }

      limiter.trigger(function () {
        if (!outstanding[queryId]) {
          // query has been aborted
          limiter.skip(); // immediately process the next request in the queue
          return;
        }
        query.stats = query.stats || [];
        query.stats.push(options.name);
        outstanding[queryId].reqInProgress = options.request(options.url(op, query), req, function (err, response) {
          var st, res;
          if (!outstanding[queryId]) {
            // query has been aborted
            return;
          }
          delete outstanding[queryId].reqInProgress;
          st = options.status(err, response);
          if (st === undefined) {
            // shouldn't happen (bug or unexpected response format)
            // treat it as no result
            st = status.empty;
          }
          if (st === status.failure) {
            // don't ever ask again
            holdRequests = true;
            return callback();
          }
          if (st === status.error) {
            // try again later
            limiter.penalty();
            return requestLater();
          }

          if (st === status.success) {
            res = options.processResponse(response, query, result || {});
          }
          callback(undefined, res);
        });
      });
    }

    outstanding[queryId] = {
      callback: function (err, result) {
        if (err !== ERROR) {
          abortCounter = 0;
        }
        var finished = Boolean(result);
        delete outstanding[queryId];
        result = result || {};
        result.stats = query.stats;
        result.provider = options.name;
        fn(err, finished, queryId, query, result);
      }
    };
    executeQuery(outstanding[queryId].callback);
  }

  options = util.defaults(options, {
    interval: 340,
    penaltyInterval: 2000,
    limiter: limiters[options.name],
    request: request,
    abort: abort
  });
  options.url = initUrl(options.url);
  limiters[options.name] = options.limiter || require('limiter-component')(options.interval, options.penaltyInterval);
  limiter = limiters[options.name];
  
  return {
    forward: options.forward,
    reverse: options.reverse,
    geocode: geocode,
    abort: options.abort
  };
}
