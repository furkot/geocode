import initService from '../index.js';
import status from '../status.js';
import util from '../util.js';

export default init;

function request(_url, _req, fn) {
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
    processResponse(_response, query, result) {
      result.places = options.response(query);
      return result;
    }
  });
  if (options.synchronous_parameters) {
    options = util.defaults(options, options.synchronous_parameters);
  }
  return initService(options);
}
