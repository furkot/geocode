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

  map.on('click', function (event) {
    ll.value = event.ll[0].toFixed(6) + ', ' + event.ll[1].toFixed(6);
    window.dispatchEvent(new CustomEvent('ll', {
      detail: {
        ll: event.ll,
        max: searchFormEl.max.value,
        type: searchFormEl.place.value
      }
    }));
  });

  searchFormEl.addEventListener('submit', function (event) {
    event.preventDefault();
    const { place, ll, type, max, partial } = searchFormEl;
    if (ll.value) {
      const detail = {
        ll: ll.value.split(',').map(l => parseFloat(l.trim())),
        max: max.value,
        type: place.value
      };
      window.dispatchEvent(new CustomEvent('ll', { detail }));
    }
    else if (place.value) {
      const detail = {
        bounds: map.bounds(),
        max: max.value,
        [type.value === 'address' ? 'address' : 'place']: place.value
      };
      if (partial.checked) {
        detail.partial = true;
      }
      window.dispatchEvent(new CustomEvent('place', { detail }));
    }
  });
}

// register services

if (process.env.GEOCODIO_KEY) {
  service('geocodio', {
    order: ['geocodio'],
    geocodio_parameters: { interval: 1000 },
    geocodio_enable() { return true; },
    geocodio_key: process.env.GEOCODIO_KEY
  });
}
if (process.env.GRAPHHOPPER_KEY) {
  service('graphhopper', {
    order: ['graphhopper'],
    graphhopper_parameters: { interval: 1000 },
    graphhopper_enable() { return true; },
    graphhopper_key: process.env.GRAPHHOPPER_KEY
  });
}
if (process.env.HOGFISH_KEY) {
  service('hogfish', {
    order: ['hogfish'],
    hogfish_parameters: {
      interval: 1000,
      types: {
        hotel: [
          'provider=hotels'
        ],
        fillingstation: [
          'provider=fuel'
        ],
        place: [
          'provider=universal'
        ]
      }
    },
    hogfish_enable() { return true; },
    hogfish_url: process.env.HOGFISH_URL
  });
}
if (process.env.LOCATIONIQ_KEY) {
  service('locationiq', {
    order: ['locationiq'],
    locationiq_parameters: { interval: 1000 },
    locationiq_enable() { return true; },
    locationiq_key: process.env.LOCATIONIQ_KEY
  });
}
if (process.env.OPENCAGE_KEY) {
  service('opencage', {
    order: ['opencage'],
    opencage_parameters: { interval: 1000 },
    opencage_enable() { return true; },
    opencage_key: process.env.OPENCAGE_KEY
  });
}
if (process.env.OPENROUTE_KEY) {
  service('openroute', {
    order: ['pelias'],
    pelias_parameters: { interval: 1000 },
    pelias_enable() { return true; },
    pelias_key: process.env.OPENROUTE_KEY
  });
}
if (process.env.POSITIONSTACK_KEY) {
  service('positionstack', {
    order: ['positionstack'],
    positionstack_parameters: { interval: 1000 },
    positionstack_enable() { return true; },
    positionstack_key: process.env.POSITIONSTACK_KEY
  });
}
if (process.env.TILEHOSTING_KEY) {
  service('tilehosting', {
    order: ['tilehosting'],
    tilehosting_parameters: { interval: 1000 },
    tilehosting_enable() { return true; },
    tilehosting_key: process.env.TILEHOSTING_KEY
  });
}

function service(name, options) {
  const resultEl = appendTo(geocodersEl, template);
  const geocode = furkotGeocode(options);
  window.addEventListener('ll', onSearch);
  window.addEventListener('place', onSearch);

  async function onSearch({ detail }) {
    resultEl.classList.add('in-progress');
    try {
      const { places } = await geocode(detail);
      resultEl.value = places
        .map(
          place => JSON
            .stringify(place, formatter, 2)
            .replace('"[', '[')
            .replace(']"', ']')
        )
        .join(', ');
    }
    catch (e) {
      resultEl.value = '';
    }
    finally {
      resultEl.classList.remove('in-progress');
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
}

function formatter(key, value) {
  if (key === 'll') {
    return '[ ' + value.join(', ') + ' ]';
  }
  return value;
}
