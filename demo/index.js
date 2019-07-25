
/* global mapboxgl */

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

const furkotGeocode = require('..');
const maps = require('maps-facade').init({ service: 'mapbox' }, onMapInit);

const ll = document.getElementById('ll');
const template = document.querySelector('#service');
const geocodersEl = document.querySelector('#geocoders');
const searchFormEl = document.querySelector('.search-form');

function onMapInit() {
  const mapEl = document.getElementById('map');
  const map = maps.map(mapEl, {
    style: process.env.MAP_STYLE,
    zoomControl: true,
    zoomControlOptions: { position: 'RB' },
    center: [-100, 40],
    zoom: 4
  });

  map.on('click', function(event) {
    ll.value = event.ll[0].toFixed(6) + ', ' + event.ll[1].toFixed(6);
    window.dispatchEvent(new CustomEvent('ll', { detail: {
      ll: event.ll,
      max: searchFormEl.max.value
    }}));
  });

  searchFormEl.addEventListener('submit', function(event) {
    event.preventDefault();
    if (searchFormEl.place.value) {
      const detail = {
        bounds: map.bounds(),
        place: searchFormEl.place.value,
        max: searchFormEl.max.value
      };
      window.dispatchEvent(new CustomEvent('place', { detail }));
    }
    else if (searchFormEl.ll.value) {
      const ll = searchFormEl.ll.value.split(',').map(function (l) {
        return parseFloat(l.trim());
      });
      window.dispatchEvent(new CustomEvent('ll', { detail: {
        ll,
        max: searchFormEl.max.value
      }}));
    }
  });
}

// register services

if (process.env.GEOCODIO_KEY) {
  service('geocodio', {
    order: ['geocodio'],
    geocodio_parameters: { interval : 1000 },
    geocodio_enable() { return true; },
    geocodio_key: process.env.GEOCODIO_KEY
  });
}
if (process.env.GRAPHHOPPER_KEY) {
  service('graphhopper', {
    order: ['graphhopper'],
    graphhopper_parameters: { interval : 1000 },
    graphhopper_enable() { return true; },
    graphhopper_key: process.env.GRAPHHOPPER_KEY
  });
}
if (process.env.LOCATIONIQ_KEY) {
  service('locationiq', {
    order: ['locationiq'],
    locationiq_parameters: { interval : 1000 },
    locationiq_enable() { return true; },
    locationiq_key: process.env.LOCATIONIQ_KEY
  });
}
if (process.env.OPENCAGE_KEY) {
  service('opencage', {
    order: ['opencage'],
    opencage_parameters: { interval : 1000 },
    opencage_enable() { return true; },
    opencage_key: process.env.OPENCAGE_KEY
  });
}
if (process.env.OPENROUTE_KEY) {
  service('openroute', {
    order: ['pelias'],
    pelias_parameters: { interval : 1000 },
    pelias_enable() { return true; },
    pelias_key: process.env.OPENROUTE_KEY
  });
}
if (process.env.TILEHOSTING_KEY) {
  service('tilehosting', {
    order: ['tilehosting'],
    tilehosting_parameters: { interval : 1000 },
    tilehosting_enable() { return true; },
    tilehosting_key: process.env.TILEHOSTING_KEY
  });
}

function service(name, options) {
  const resultEl = appendTo(geocodersEl, template);
  const geocode = furkotGeocode(options);

  function onLocationChange(event) {
    resultEl.classList.add('in-progress');
    geocode({
      ll: event.detail.ll,
      max: event.detail.max
    }, onResults);
  }

  function onSearch(event) {
    resultEl.classList.add('in-progress');
    geocode({
      place: event.detail.place,
      bounds: event.detail.bounds,
      max: event.detail.max,
      partial: true
    }, onResults);
  }

  function onResults(res) {
    resultEl.classList.remove('in-progress');
    if (res && res.places) {
      resultEl.value = res.places.map(function(place) {
        return JSON.stringify(place, formatter, 2).replace('"[', '[').replace(']"', ']');
      }).join(', ');
    } else {
      resultEl.value = '';
    }
  }

  function appendTo(geocodersEl, template) {
    // Clone the new row and insert it into the table
    const resultbox = document.importNode(template.content, true);
    resultbox.querySelector('label').innerHTML = name;
    const resultEl = resultbox.querySelector('textarea');
    geocodersEl.appendChild(resultbox);
    return resultEl;
  }

  window.addEventListener('ll', onLocationChange);
  window.addEventListener('place', onSearch);
}

function formatter(key, value) {
  if (key === 'll') {
    return '[ '+ value.join(', ') + ' ]';
  }
  return value;
}
