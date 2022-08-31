const status = require('../status');
const util = require('../util');

module.exports = init;

function request(url, req, fn) {
  fn();
}

function getUrl() {}

function prepareRequest() {
  return true;
}

function getStatus() {
  return status.success;
}

function init(options) {
  options = util.defaults(options, {
    forward: true,
    reverse: true,
    request,
    url: getUrl,
    status: getStatus,
    prepareRequest,
    processResponse(response, query, result) {
      result.places = options.response(query);
      return result;
    }
  });
  if (options.synchronous_parameters) {
    options = util.defaults(options, options.synchronous_parameters);
  }
  return require('..')(options);
}
