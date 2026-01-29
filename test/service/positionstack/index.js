import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import positionstack from '../../../lib/service/positionstack/index.js';

describe('positionstack geocoding', () => {
  const { geocode } = positionstack({
    interval: 1,
    name: 'positionstack',
    positionstack_key: process.env.POSITIONSTACK_KEY || 'furkot'
  });

  it('forward', async () => {
    const query = {
      address: 'Rua Cafelândia, Carapicuíba, Brasil'
    };
    const result = await geocode('forward', 1, query);
    assert.ok(result != null, 'should exist');
    assert.equal(result.places?.length, 1);
    assert.deepEqual(result.places[0], {
      ll: [-46.830942, -23.532918],
      type: 'locality',
      town: 'Carapicuíba',
      province: 'Sao Paulo',
      country: 'Brazil',
      place: 'Carapicuíba',
      address: 'Carapicuíba, Sao Paulo, Brazil',
      normal: 'Carapicuíba,Sao Paulo,BR'
    });
  });

  it('place', async () => {
    const query = {
      place: 'Golden Gate Bridge'
    };
    const result = await geocode('forward', 1, query);
    assert.ok(result != null, 'should exist');
    assert.equal(result.places?.length, 10);
    assert.deepEqual(result.places[0], {
      ll: [-122.478861, 37.822118],
      type: 'venue',
      town: 'San Francisco',
      province: 'CA',
      country: 'USA',
      place: 'Golden Gate Bridge',
      address: 'San Francisco, CA',
      normal: 'San Francisco,CA,US'
    });
  });

  it('partial', async () => {
    const query = {
      place: 'Golden Gate Br'
    };
    const result = await geocode('forward', 1, query);
    assert.ok(result != null, 'should exist');
    assert.equal(result.places?.length, 10);
    assert.deepEqual(result.places[0], {
      ll: [-49.542449, -11.928923],
      type: 'country',
      country: 'Brazil',
      place: 'Brazil',
      address: 'Brazil',
      normal: 'BR'
    });
  });

  it('reverse', async () => {
    const query = {
      ll: [14.5272, -22.6792]
    };
    const result = await geocode('reverse', 1, query);
    assert.ok(result != null, 'should exist');
    assert.equal(result.places?.length, 10);
    assert.deepEqual(result.places[0], {
      ll: [14.526802, -22.679183],
      type: 'venue',
      province: 'Erongo',
      country: 'Namibia',
      place: "Beryl's Restaurant",
      address: 'Erongo, Namibia',
      normal: 'Erongo,NA'
    });
  });
});
