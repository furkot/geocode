import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import pelias from '../../../lib/service/pelias/index.js';

describe('stadiamaps geocoding', () => {
  const { geocode } = pelias({
    interval: 1,
    name: 'pelias',
    pelias_parameters: {
      enablePartial: true
    },
    pelias_url: 'https://api.stadiamaps.com/geocoding/v2',
    pelias_key: process.env.PELIAS_KEY || 'furkot'
  });

  it('partial address', async () => {
    const query = {
      address: 'North Nellis',
      partial: true
    };
    const result = await geocode('forward', 1, query);
    assert.ok(result != null, 'should exist');
    assert.equal(result.places?.length, 10);
    assert.deepEqual(result.places[0], {
      type: 'poi',
      place: 'Southbound Nellis at 3909 N. Nellis',
      gid: 'openstreetmap:venue:node/13124284320',
      normal: '',
      address: ''
    });
    assert.deepEqual(result.places[1], {
      type: 'poi',
      place: 'Southbound Nellis at 401 North Nellis',
      gid: 'openstreetmap:venue:node/13124284335',
      normal: '',
      address: ''
    });
    assert.deepEqual(result.places[2], {
      type: 'street',
      gid: 'openstreetmap:street:polyline:33696302',
      place: 'North Nellis Boulevard, Sunrise Manor, NV, USA',
      normal: '',
      address: ''
    });
    assert.deepEqual(result.places[3], {
      type: 'street',
      gid: 'openstreetmap:street:polyline:33696455',
      place: 'North Nellis Boulevard, Sunrise Manor, NV, USA',
      normal: '',
      address: ''
    });
    assert.deepEqual(result.places[4], {
      type: 'street',
      gid: 'openstreetmap:street:polyline:18181753',
      place: 'North Nellis Boulevard, North Las Vegas, NV, USA',
      normal: '',
      address: ''
    });
    assert.deepEqual(result.places[5], {
      type: 'poi',
      place: 'No. 1 Boba Tea Nellis',
      gid: 'foursquare:venue:5d1e96a7e2dcb40023186f4e',
      normal: '',
      address: ''
    });
    assert.deepEqual(result.places[6], {
      type: 'poi',
      place: 'Sandusky County Court No. 1',
      gid: 'openstreetmap:venue:way/881530143',
      normal: '',
      address: ''
    });
    assert.deepEqual(result.places[7], {
      type: 'poi',
      place: 'North American F-86E Sabre',
      gid: 'openstreetmap:venue:node/6750720522',
      normal: '',
      address: ''
    });
    assert.deepEqual(result.places[8], {
      type: 'poi',
      place: 'North American F-100D Super Sabre',
      gid: 'openstreetmap:venue:node/6750720519',
      normal: '',
      address: ''
    });
    assert.deepEqual(result.places[9], {
      type: 'poi',
      place: 'CAOC-N',
      gid: 'foursquare:venue:4e36db8ad4c06343483c5dd9',
      normal: '',
      address: ''
    });
  });

  it('address from identifier', async () => {
    const query = {
      gid: 'openstreetmap:street:polyline:33696302'
    };
    const result = await geocode('forward', 1, query);
    assert.ok(result != null, 'should exist');
    assert.equal(result.places?.length, 1);
    assert.deepEqual(result.places[0], {
      ll: [-115.062249, 36.197513],
      type: 'street',
      street: 'North Nellis Boulevard',
      town: 'Sunrise Manor',
      county: 'Clark County',
      province: 'NV',
      country: 'USA',
      normal: 'North Nellis Boulevard,Sunrise Manor,NV,US',
      address: 'North Nellis Boulevard, Sunrise Manor, NV'
    });
  });
});
