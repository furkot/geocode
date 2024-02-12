const { prettify, stringify } = require('@furkot/address');

module.exports = {
  defaults,
  prettify,
  removeEmpties,
  stringify,
  toObject,
  withTimeout
};

function defaults(obj, source) {
  return Object.assign({}, source, obj);
}

function removeEmpties(place) {
  Object.keys(place).forEach(function (key) {
    if (!place[key]) {
      delete place[key];
    }
  });
  return place;
}

function toObject(array) {
  return array.reduce(function (obj, e) {
    obj[e] = e;
    return obj;
  }, {});
}

function withTimeout(promise, timeout) {
  let id;
  return Promise
    .race([promise, new Promise(timeoutPromise)])
    .finally(() => clearTimeout(id));

  function timeoutPromise(_, reject) {
    id = setTimeout(
      () => reject(Error('timeout', { cause: Symbol.for('timeout') })),
      timeout
    );
  }
}
