const should = require('should');
const synchronous = require('../../../lib/service/synchronous');

describe('synchronous geocoding', function () {

  const geocode = synchronous({
    name: 'local',
    synchronous_parameters: {
      response(query) {
        if (query.place === 'Sołdek') {
          return [{
            ll: [18.658663, 54.351444],
            place: 'SS Sołdek'
          }];
        }
      }
    }
  }).geocode;

  it('place', async function () {
    const query = {
      place: 'Sołdek',
      lang: 'pl'
    };
    const result = await geocode('forward', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(1);
    result.places[0].should.deepEqual({
      ll: [18.658663, 54.351444],
      place: 'SS Sołdek',
      normal: ''
    });
  });

});
