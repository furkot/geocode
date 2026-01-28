import { describe, it } from 'node:test';

import { should as loadShould } from 'chai';

const should = loadShould();

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
    should.exist(result);
    result.should.have.property('places').with.length(1);
    result.places[0].should.deep.equal({
      ll: [18.658663, 54.351444],
      place: 'SS Sołdek',
      address: '',
      normal: ''
    });
  });
});
