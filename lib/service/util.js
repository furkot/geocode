module.exports = {
  defaults: defaults
};

function defaults(obj, source) {
  return Object.assign({}, source, obj);
}
