import initService from '../index.js';
import normalize from '../normalize.js';
import status from '../status.js';
import util from '../util.js';

export default init;

/*
 * https://github.com/pelias/documentation/blob/master/search.md#search-the-world
 * https://github.com/pelias/documentation/blob/master/reverse.md#reverse-geocoding
 */

function getStatus(err, response) {
  if (err && !response) {
    return status.failure;
  }
  if (!response) {
    return status.error;
  }
  if (!response.features || response.features.length === 0) {
    return status.empty;
  }
  return status.success;
}

/*
Examples:

https://api.openrouteservice.org/geocode/search?api_key=${API_KEY}&text=SS%20So%C5%82dek"
https://api.openrouteservice.org/geocode/autocomplete?api_key=${API_KEY}&text=SS%20So%C5%82dek"
https://api.openrouteservice.org/geocode/reverse?api_key=${API_KEY}&point.lat=-22.6792&point.lon=14.5272"

*/

function getUrl(url, key, enablePartial, v2, op, query) {
  const q = [];
  let suffix;
  switch (op) {
    case 'forward':
      if (query.gid) {
        suffix = '/place';
        q.push(`ids=${query.gid}`);
        break;
      }
      suffix = query.partial && enablePartial ? '/autocomplete' : '/search';
      q.push(`text=${encodeURIComponent(query.address || query.place)}`);
      if (query.bounds) {
        const [sw, ne] = query.bounds;
        if (query.address) {
          q.push(
            `boundary.rect.min_lon=${sw[0]}`,
            `boundary.rect.min_lat=${sw[1]}`,
            `boundary.rect.max_lon=${ne[0]}`,
            `boundary.rect.max_lat=${ne[1]}`
          );
          if (v2) {
            q.push('layers=address,street');
          } else {
            q.push('layers=address');
          }
        } else {
          const ll = [(sw[0] + ne[0]) / 2, (sw[1] + ne[1]) / 2];
          q.push(`focus.point.lon=${ll[0]}`, `focus.point.lat=${ll[1]}`);
          if (v2) {
            q.push('layers=poi,coarse');
          } else {
            q.push('layers=venue,coarse');
          }
        }
      }
      break;
    case 'reverse':
      suffix = '/reverse';
      q.push(`point.lon=${query.ll[0]}`, `point.lat=${query.ll[1]}`);
      break;
    default:
      // invalid operation
      return;
  }
  if (query.max) {
    q.push(`size=${query.max}`);
  }
  if (query.lang) {
    const lang = query.lang.toLowerCase().split('_').join('-');
    q.push(`lang=${lang}`);
  }
  if (key) {
    q.push(`api_key=${key}`);
  }
  if (suffix !== '/autocomplete' && v2) {
    // TODO implement a separate module for Pelias API v2 aka StadiaMaps
    url = url.replace('/v2', '/v1');
  }
  return `${url + suffix}?${q.join('&')}`;
}

function prepareRequest() {
  return true;
}

function filter(f) {
  return f.type === 'Feature' && (!f.geometry || f.geometry?.type === 'Point');
}

const ID_TOKEN = '__ID__';
const SOURCES = {
  openstreetmap: `https://www.openstreetmap.org/${ID_TOKEN}`,
  whosonfirst: `https://spelunker.whosonfirst.org/id/${ID_TOKEN}/`
};

function map(f) {
  const p = f.properties;
  const place = {
    ll: f.geometry?.coordinates,
    type: p.layer,
    house: p.housenumber,
    street: p.street,
    town: p.locality,
    county: p.county,
    province: normalize.state(p.region),
    country: normalize.country(p.country)
  };
  if (place.type === 'venue' || place.type === 'poi') {
    place.place = p.name;
    if (this.type) {
      place.type = this.type;
    }
    const url = SOURCES[p.source];
    if (url) {
      place.url = url.replace(ID_TOKEN, p.source_id);
    }
  }
  if (!place.ll) {
    place.gid = p.gid;
    place.place ??= [p.name, p.coarse_location].filter(Boolean).join(', ');
  }

  // remove empties
  return util.removeEmpties(place);
}

function venueFirst(
  { properties: { confidence: c1, distance: d1, layer: l1 } },
  { properties: { confidence: c2, distance: d2, layer: l2 } }
) {
  if (c1 !== c2) {
    // higher confidence is better
    return c2 - c1;
  }
  if (d1 !== d2) {
    // lower distance is better
    return d1 - d2;
  }
  if (l1 === l2) {
    return 0;
  }
  if (l1 === 'venue' || l1 === 'poi') {
    return -1;
  }
  if (l2 === 'venue' || l2 === 'poi') {
    return 1;
  }
  return 0;
}

function processResponse({ features }, query, result) {
  const places = features.filter(filter);
  if (query.type) {
    places.sort(venueFirst);
  }
  result.places = places.map(map, query);
  return result;
}

function init(options) {
  const url = options.pelias_url || 'https://api.openrouteservice.org/geocode';
  options = util.defaults(options, {
    forward: true,
    reverse: true,
    url: getUrl.bind(undefined, url, options.pelias_key, options.pelias_parameters?.enablePartial, url.endsWith('/v2')),
    status: getStatus,
    prepareRequest,
    processResponse
  });
  if (options.pelias_parameters) {
    options = util.defaults(options, options.pelias_parameters);
  }
  return initService(options);
}
