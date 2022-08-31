module.exports = {
  address,
  defaults,
  removeEmpties,
  toObject
};

function defaults(obj, source) {
  return Object.assign({}, source, obj);
}

function address(place) {
  return [place.street, place.town || place.county, place.province, place.country]
    .filter(function (s) { return s; })
    .join(', ');
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
