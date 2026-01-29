import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import synchronous from '../../../lib/service/synchronous/index.js';

describe('synchronous geocoding', () => {
  const geocode = synchronous({
    name: 'local',
    synchronous_parameters: {
      response(query) {
        if (query.place === 'Sołdek') {
          return [
            {
              ll: [18.658663, 54.351444],
              place: 'SS Sołdek'
            }
          ];
        }
      }
    }
  }).geocode;

  it('place', async () => {
    const query = {
      place: 'Sołdek',
      lang: 'pl'
    };
    const result = await geocode('forward', 1, query);
    assert.ok(result != null, 'should exist');
    assert.equal(result.places?.length, 1);
    assert.deepEqual(result.places[0], {
      ll: [18.658663, 54.351444],
      place: 'SS Sołdek',
      address: '',
      normal: ''
    });
  });
});
