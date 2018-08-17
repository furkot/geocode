module.exports = groupPlaces;

function inside(bounds, place) {
  return bounds[0][0] < place.ll[0] && place.ll[0] < bounds[1][0] &&
    bounds[0][1] < place.ll[1] && place.ll[1] < bounds[1][1];
}

function distance(bounds, place) {
  return Math.pow(place.ll[0] - (bounds[0][1] - bounds[0][0]) / 2, 2) +
    Math.pow(place.ll[1] - (bounds[1][1] - bounds[1][0]) / 2, 2);
}

function whichGroup(bounds, i) {
  var place = this.place, groups = this.groups, dist = this.distance;
  if (!bounds) {
    return;
  }
  if (inside(bounds, place)) {
    groups[i] = groups[i] || [];
    groups[i].push(place);
    return true;
  }
  place.distance = distance(bounds, place);
  if (place.distance < dist) {
    this.distance = place.distance;
    this.pos = i;
  }
}

function groupPlace(result, place) {
  var params = {
    place: place,
    groups: result.groups,
    distance: Number.MAX_VALUE
  }, pos;
  if (!result.bounds.some(whichGroup, params)) {
    pos = result.bounds.length + params.pos;
    result.groups[pos] = result.groups[pos] || [];
    result.groups[pos].push(place);
  }
  return result;
}

function placeCompare(p1, p2) {
  return p2.distance - p1.distance;
}

function sortPlaces(result, places) {
  Array.prototype.push.apply(result, places.sort(placeCompare));
  return result;
}

function groupPlaces(bounds, places) {
  places = places.reduce(groupPlace, {
    bounds: bounds,
    groups: []
  }).groups;
  places = places.reduce(sortPlaces, []);
  return places;
}
