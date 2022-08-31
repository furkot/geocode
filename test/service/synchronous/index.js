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

  it('place', function (done) {
    const query = {
      place: 'Sołdek',
      lang: 'pl'
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(1);
      result.places[0].should.deepEqual({
        ll: [18.658663, 54.351444],
        place: 'SS Sołdek'
      });
      result.should.have.property('provider', 'local');
      result.should.have.property('stats', ['local']);
      done();
    });
  });

});
