
/* global mapboxgl */

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

var furkotGeocode = require('..');
var maps = require('maps-facade').init({ service: 'mapbox' }, onMapInit);

var ll = document.getElementById('ll');
var template = document.querySelector('#service');
var geocodersEl = document.querySelector('#geocoders');
var searchFormEl = document.querySelector('.search-form');

function onMapInit() {
  var mapEl = document.getElementById('map');
  var map = maps.map(mapEl, {
    style: process.env.MAP_STYLE,
    zoomControl: true,
    zoomControlOptions: { position: 'RB' },
  });

  map.on('click', function(event) {
    ll.value = event.ll[0].toFixed(6) + ', ' + event.ll[1].toFixed(6);
    window.dispatchEvent(new CustomEvent('ll', { detail: event.ll }));
  });

  searchFormEl.addEventListener('submit', function(event) {
    event.preventDefault();
    var detail = {
      bounds: map.bounds(),
      place: searchFormEl.place.value
    };
    window.dispatchEvent(new CustomEvent('place', { detail: detail }));
  });
}

// register services

service('opencage', {
  order: ['opencage'],
  opencage_parameters: { interval : 1000 },
  opencage_enable: function() { return true; },
  opencage_key: process.env.OPENCAGE_KEY
});
service('openroute', {
  order: ['openroute'],
  openroute_parameters: { interval : 1000 },
  openroute_enable: function() { return true; },
  openroute_key: process.env.OPENROUTE_KEY
});
service('tilehosting', {
  order: ['tilehosting'],
  tilehosting_parameters: { interval : 1000 },
  tilehosting_enable: function() { return true; },
  tilehosting_key: process.env.TILEHOSTING_KEY
});
service('graphhopper', {
  order: ['graphhopper'],
  graphhopper_parameters: { interval : 1000 },
  graphhopper_enable: function() { return true; },
  graphhopper_key: process.env.GRAPHHOPPER_KEY
});
service('locationiq', {
  order: ['locationiq'],
  locationiq_parameters: { interval : 1000 },
  locationiq_enable: function() { return true; },
  locationiq_key: process.env.LOCATIONIQ_KEY
});
service('algolia', {
  order: ['algolia'],
  algolia_parameters: { interval : 1000 },
  algolia_enable: function() { return true; }
});


function service(name, options) {
  var resultEl = appendTo(geocodersEl, template);
  var geocode = furkotGeocode(options);

  function onLocationChange(event) {
    resultEl.classList.add('in-progress');
    var ll = event.detail;
    geocode({ ll: ll }, onResults);
  }

  function onSearch(event) {
    resultEl.classList.add('in-progress');
    geocode({
      place: event.detail.place,
      bounds: event.detail.bounds,
      partial: true
    }, onResults);
  }

  function onResults(res) {
    resultEl.classList.remove('in-progress');
    if (res && res.places) {
      resultEl.value = res.places.map(function(place) {
        return JSON.stringify(place, null, 2);
      }).join('\n');
    } else {
      resultEl.value = '';
    }
  }

  function appendTo(geocodersEl, template) {
    // Clone the new row and insert it into the table
    var resultbox = document.importNode(template.content, true);
    resultbox.querySelector('label').innerHTML = name;
    var resultEl = resultbox.querySelector('textarea');
    geocodersEl.appendChild(resultbox);
    return resultEl;
  }

  window.addEventListener('ll', onLocationChange);
  window.addEventListener('place', onSearch);
}
